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
      $c->render(json => {message => 'Login successful'});
      return;
    }
    else {
      $log->warn("Failed login for user: $args->{'username'}");

      push @{ $c->session->{'notifications'} }, {
        message => "Failed login",
        type    => "error"
      };
      $c->render(json => {message => 'Login failed'});
      return;
    }
  }
  else {
    $c->render(json => {message => 'Provide username and password to login'});
    return;
  }
}

1;
