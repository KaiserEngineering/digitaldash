package KEApp::Controller::App;
use Mojo::Base 'Mojolicious::Controller';
use Mojo::Log;
my $log = Mojo::Log->new;

sub home {
  my $c  = shift;

  $c->render(
      "pages/index.html",
      handler => 'mason',
  );
}

sub login {
  my $c  = shift;

  my $args = $c->req->params->to_hash;

  if ( $args->{'username'} && $args->{'password'} ) {
    my $ret = $c->authenticate(
        $args->{'username'}, $args->{'password'},
    );

    if ( $ret ) {
      $log->debug("Successful login for user: $args->{'username'}");
      $c->redirect_to('/', handler => 'mason');
    }
    else {
      $log->warn("Failed login for user: $args->{'username'}");

      push @{ $c->session->{'notifications'} }, {
        message => "Failed login",
        type    => "error"
      };
      $c->render('pages/login.html', handler => 'mason');
      return;
    }
    $c->redirect_to("/home");
  }

  $c->render(
      "pages/login.html",
      handler => 'mason',
  );
}

sub settings {
  my $c  = shift;

  $c->render(
      "pages/settings.html",
      handler => 'mason',
  );
}

sub edit {
  my $c  = shift;

  my $id = @{$c->every_param('id')}[0];
  unless ( $id ) {
      $log->error( "Must provide ID value for edit page" );
  }

  $c->render(
      "pages/edit.html",
      handler => 'mason',
      id => $id
  );
}



sub update {
  my $c = shift;
  my %args = (
    %{$c->req->json}
  );
  my $config = $c->app->{'Config'};

  my $temp_view = $config->{'views'}->{$args{'id'}};
  %{$temp_view} = %args;

  my @gauges = ();
  foreach my $gauge ( @{ $temp_view->{'gauges'} } ) {
      push @gauges, {
            %{$gauge},
            "path" => "\/$args{'theme'}\/"
      };
  }
  $temp_view->{'gauges'} = \@gauges;

  $config->{'views'}->{$args{'id'}} = $temp_view;

  my ($ret, $msg) = $c->UpdateConfig( $config );

  $c->render(json => { config => $c->app->{'Config'}, message => "Updated config!" });
}

sub delete {
  my $c = shift;
  my %args = (
    %{$c->req->json}
  );
  my $config = $c->app->{'Config'};

  unless ( $args{'id'} ) {
    $c->render(json => { config => $c->app->{'Config'}, message => "No ID value provided, could not update." });
  }
  
  delete $config->{'views'}{$args{'id'}};
  my ($ret, $msg) = $c->UpdateConfig( $config );
  $c->render(json => { config => $c->app->{'Config'}, message => "Updated config!" });
}

sub toggle_enable {
  my $c = shift;
  my $id = $c->req->json;

  my $config = $c->app->{'Config'};
  my $view = $config->{'views'}->{$id};

  $config->{'views'}->{$id}->{'enabled'} = $view->{'enabled'} ? 0 : 1;
  my ($ret, $msg) = $c->UpdateConfig( $config );

  if ( $ret ) {
    my $bool = $view->{'enabled'} ? 'True': 'False';

    $msg = "$view->{'name'} enabled set to: $bool";
  }

  $c->render(json => { config => $c->app->{'Config'}, message => $msg });
}

1;
