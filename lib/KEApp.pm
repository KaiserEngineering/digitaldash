package KEApp;
use Mojo::Base 'Mojolicious';
use JSON;

sub startup {
  my $self = shift;

  $self->config(hypnotoad => {listen => ['http://*:3000'], proxy => 1, user => 'root'});
  $self->plugin('mason1_renderer', { interp_params  => { comp_root => "/Users/craigkaiser/kaiserengineering/ke_webapp/templates/"}});

  my $config = $self->plugin('Config');
  $self->secrets(['Kaiser-ke']);

  my $file_auth;
  my $json;
  {
    local $/; #Enable 'slurp' mode
    open my $fh, "<", "auth.txt";
    $json = <$fh>;
    close $fh;
  }
  $file_auth = JSON::from_json($json);

  $self->plugin('authentication' => {
    autoload_user   => 0,
    session_key     => 'current_user',
    fail_render     => sub {
                        my ($routes, $controller, $captures, $required) = @_;
                        $controller->redirect_to('/');
                    },
    load_user       => sub {
        my $self = shift;
        my $uid  = shift;

        if ( $uid eq 999 ) {
            return %{$file_auth};
        }
        return undef;
     },
    validate_user   => sub {
        my $self     = shift;
        my $name     = shift;
        my $pass     = shift;

        if ( $file_auth->{'user'} eq $name && $file_auth->{'pass'} eq $pass ) {
            return 999;
        }

        return 0;
    },
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

  $self->hook(after_dispatch => sub {
      my $c = shift;
      $c->res->headers->header('Access-Control-Allow-Origin' => 'foundation:5000');
      $c->res->headers->access_control_allow_origin('*');
      $c->res->headers->header('Access-Control-Allow-Methods' => 'GET, OPTIONS, POST, DELETE, PUT');
      $c->res->headers->header('Access-Control-Allow-Headers' => 'Content-Type' => '*');
  });

  # Router
  my $r = $self->routes;

  $self->plugin('SecureCORS');

  $r->cors('/api/update');

  $r->get('/')->over(authenticated => 1)->to('API#index');

  $r->get('/')->over(authenticated => 0)->to('Auth#login');

  $r->post('/login')->to('Auth#login');

  $r->get('/api/config/')->over(authenticated => 1)->to('API#config');

  $r->get('/api/constants/')->over(authenticated => 1)->to('API#constants');

  $r->put('/api/update/', {'cors.origin' => '*'})->over(authenticated => 1)->to('API#update');

}

1;
