package KEApp::Controller::API;
use Mojo::Base 'Mojolicious::Controller';


sub config {
  my $c = shift;

  $c->render(json => $c->app->{'Config'});
}

sub constants {
    my $c = shift;

    $c->render(json => $c->app->{'Constants'});
}

sub index {
  my $c  = shift;

  $c->reply->static('index.html');
}

sub login {
  my $c = shift;

  $c->Notification;

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

sub edit {
  my $c = shift;

  my $id = @{$c->every_param('id')}[0];

  $c->render( "edit.html", handler => 'mason', id => $id);
}

sub update {
  my $c = shift;
  my %args = (
    id     => undef,
    name   => undef,
    pid0   => undef,
    pid1   => undef,
    pid2   => undef,
    gaugeTheme  => undef,
    backgroundTheme => undef,
    %{$c->req->params->to_hash}
  );
  $c->OnlyIfLoggedIn;
  my $config = $c->app->{'Config'};

  $c->Notification;

  my $temp_view = $config->{'views'}->{$args{'id'}};
  $temp_view->{'name'} = $args{'name'};
  $temp_view->{'pids'} = [
    $args{'pid0'},
    $args{'pid1'},
    $args{'pid2'},
  ];
  $temp_view->{'background'} = $args{'backgroundTheme'};
  $temp_view->{'theme'} = $args{'gaugeTheme'};

  my @gauges = ();
  foreach my $gauge ( @{ $temp_view->{'gauges'} } ) {
      push @gauges, {
            %{$gauge},
            "path" => "static/imgs/".$args{'gaugeTheme'}."/"
      };
  }
  $temp_view->{'gauges'} = \@gauges;

  $temp_view->{'dynamic'} = {
    "pid"       => $args{'dynamicParameter'},
    "op"        => $args{'dynamicOperator'},
    "value"     => $args{'dynamicValue'},
    "priority"  => $args{'dynamicPriority'},
  };

  $temp_view->{'alerts'} = [{
    "pid"       => $args{'alertIndex'},
    "op"        => $args{'alertOperator'},
    "value"     => $args{'alertValue'},
    "priority"  => $args{'alertPriority'},
    "message"   => $args{'alertMessage'},
  }];

  $config->{'views'}->{$args{'id'}} = $temp_view;

  my ($ret, $msg) = $c->UpdateConfig( $config );
  push @{ $c->session->{'notifications'} }, {
    message => $msg,
    type    => "info"
  };

  $c->redirect_to( "/edit?id=$args{'id'}" );
}

sub advanced {
  my $c = shift;
  my $config = $c->req->params->to_hash;

  if ( $config->{'config'} ) {
      # update
  }

  $c->render( "advanced.html", handler => 'mason' );
}

1;
