package KEApp::Controller::API;
use Mojo::Base 'Mojolicious::Controller';
use Mojo::Log;
use KEApp::Model::Config;
use strict;
use warnings;

my $log = Mojo::Log->new;

sub auth {
  my $c = shift;

  my $args = $c->req->json;

  if ( $args->{'username'} && $args->{'password'} ) {
    my $ret = $c->authenticate(
        $args->{'username'}, $args->{'password'},
    );

    if ( $ret ) {
      $log->debug("Successful login for user: $args->{'username'}");
      $c->render(json => { res => 1, message => 'Login successful'} );
      return;
    }
    else {
      $log->warn("Failed login for user: $args->{'username'}");
      $c->render(json => {res => 0, message => 'Login failed' });
      return;
    }
  }
  else {
    $c->render(json => { res => 0, message => 'Provide username and password to login' });
    return;
  }
}


sub settings {
  my $c    = shift;
  my $args = $c->req->json;

  if ( $args->{'username'} && $args->{'password'} ) {
    {
      local $/; #Enable 'slurp' mode
      open my $fh, ">", "$ENV{'KEWebAppHome'}/auth.txt";
      print $fh qq[
{
  "user":"$args->{'username'}",
  "pass":"$args->{'password'}"
}];
      close $fh;
    }
  }
  $c->render(json => {message => 'Settings updated'});
}

sub config {
  my $c = shift;

  $c->render(json => {
    views     => $c->app->{'Config'}->{'views'},
    constants => $c->app->{'Constants'},
  });
}


sub toggleEnabled {
  my $c  = shift;
  my $id = $c->req->json->{'id'};

  my $config = $c->app->{'Config'};
  my $view = $config->{'views'}->{$id};

  $config->{'views'}->{$id}->{'enabled'} = $view->{'enabled'} ? 0 : 1;
  my ($ret, $msg) = $c->UpdateConfig( $config );

  if ( $ret ) {
    my $bool = $view->{'enabled'} ? 'True': 'False';

    $msg = "$view->{'name'} enabled set to: $bool";
  }

  $c->render(json => { views => $c->app->{'Config'}->{'views'}, message => $msg });
}

sub update {
  my $c      = shift;
  my %args   = %{$c->req->json};
  my $config = $c->app->{'Config'};

  my $id = $args{'id'};
  unless ( defined $id ) {
      $log->error( "Must provide ID value for edit page" );
  }

  my $temp_view = $config->{'views'}->{$args{'id'}};

  KEApp::Model::Config::UpdateAlerts( $temp_view, %args );
  KEApp::Model::Config::UpdateGauges( $temp_view, %args );
  %{$temp_view} = (%{$temp_view}, %args);

  $config->{'views'}->{$args{'id'}} = $temp_view;

  my ($ret, $msg) = $c->UpdateConfig( $config );
  $c->render(json => { message => $msg });
}

1;
