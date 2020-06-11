package KEApp::Controller::Auth;
use Mojo::Base 'Mojolicious::Controller';

sub login {
  my $c = shift;

  my $args = $c->req->params->to_hash;

  if ( $args->{'username'} && $args->{'password'} ) {
    my $ret = $c->authenticate(
        $args->{'username'}, $args->{'password'},
    );

    if ( $ret ) {
      push @{ $c->session->{'notifications'} }, {
        message => "You are logged in!",
        type    => "info"
      };
      $c->redirect_to('/', handler => 'mason');
    }
    else {
      push @{ $c->session->{'notifications'} }, {
        message => "Failed login",
        type    => "error"
      };
      $c->render('login.html', handler => 'mason');
    }
    return;
  }

  $c->render('login.html', handler => 'mason');
}

1;
