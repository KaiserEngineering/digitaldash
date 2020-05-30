package KEApp;
use Mojo::Base 'Mojolicious';
use JSON;

sub startup {
  my $self = shift;

  $self->config(hypnotoad => {listen => ['http://*:3000'], proxy => 1, user => 'root'});
  $self->plugin('mason1_renderer', { interp_params  => { comp_root => "/Users/craigkaiser/kaiserengineering/ke_webapp/templates/"}});

  my $config = $self->plugin('Config');
  $self->secrets(['Kaiser-ke']);

  $self->plugin('authentication' => {
    autoload_user   => 0,
    session_key     => 'current_user',
    fail_render     => sub {
                        my ($routes, $controller, $captures, $required) = @_;
                        push @{ $controller->session->{0} }, 'A problem with your Auth occured';
                        $controller->redirect_to('/login');
                    },
    load_user       => sub {
        my $self = shift;
        my $uid = shift;
        return 1;
        # return $uid;
     },
    validate_user   => sub {
        my $self     = shift;
        my $name     = shift;
        my $password = shift;

        return 1;
    },
  });

  $self->helper(Notification => sub {
    my $msg = $self->param('msg');
    my $msg_type = $self->param('msg_type');
    if ( $msg ) { push @{ $self->session->{$msg_type} },  $msg; }
  });

  # Redirect If Not Logged In Helper
  $self->helper(OnlyIfLoggedIn => sub {
    my $self = shift;
    if ( !$self->is_user_authenticated ) {
            push @{ $self->session->{0} }, 'You are not logged in!';
            return;
        }
    return 1;
  });

  $self->helper(LoadConfig => sub {
    my $json;
    {
      local $/; #Enable 'slurp' mode
      open my $fh, "<", "/Users/craigkaiser/kaiserengineering/DigitalDash_GUI/digital_dash_gui/etc/config.json";
      $json = <$fh>;
      close $fh;
    }
    $self->{'Config'} = JSON::from_json($json);
  });
  $self->LoadConfig();

  $self->helper(UpdateConfig => sub {
    my $c      = shift;
    my $config = shift;

    my $json_pretty = JSON::to_json( $config, { canonical => 1, pretty => 1 });
    {
      local $/; #Enable 'slurp' mode
      open my $fh, ">", "/Users/craigkaiser/kaiserEngineering/DigitalDash_GUI/digital_dash_gui/etc/config.json";
      print $fh $json_pretty;
      close $fh;
    }
    $self->{'Config'} = $config;
    return (1, "Config updated");
  });

  $self->helper(LoadConstants => sub {
    my $json;
    {
      local $/; #Enable 'slurp' mode
      open my $fh, "<", "/Users/craigkaiser/kaiserengineering/DigitalDash_GUI/digital_dash_gui/static/constants.json";
      $json = <$fh>;
      close $fh;
    }
    $self->{'Constants'} = JSON::from_json($json);
  });
  $self->LoadConstants();

  $self->plugin('SecureCORS');
  $self->routes->to('cors.origin' => '*');

  # Router
  my $r = $self->routes;

  $r->get('/')->to('API#index');

  $r->post('/api/login')->to('API#login');

  $r->post('/api/current_user')->to('API#current_user');

  $r->get('/api/config/')->to('API#config');

  $r->get('/api/constants/')->to('API#constants');

  $r->post('/api/update/')->to('API#update');

  $r->get('/')->over(authenticated => 1)->to('API#index');

  $r->get('/')->to('API#login');

  $r->get('/login')->to('API#login');

  $r->post('/login')->to('API#login');

  $r->get('/edit/')->over(authenticated => 1)->to('API#edit');

  $r->post('/update')->over(authenticated => 1)->to('API#update');

  $r->get('/advanced/')->over(authenticated => 1)->to('API#advanced');
}

1;
