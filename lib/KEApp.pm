package KEApp;
use Mojo::Base Mojolicious, -strict, -signatures;
use JSON;

sub startup {
  my $self = shift;

  my $web_home = $ENV{'KEWebAppHome'} || '/opt/ke_webapp';
  my $gui_home = $ENV{'KEGUIHome'} || '/opt/DigitalDash_GUI';

  $self->config(hypnotoad => {listen => ['http://*:80'], proxy => 1, user => 'root'});

  my $config = $self->plugin('Config');
  $self->secrets(['Kaiser-ke']);

  my $file_auth;
  my $json;
  {
    local $/; #Enable 'slurp' mode
    open my $fh, "<", "$web_home/auth.txt";
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

        # Hack as heck
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
      open my $fh, "<", "$gui_home/etc/config.json";
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
      open my $fh, ">", "$gui_home/etc/config.json";
      print $fh $json_pretty;
      close $fh;
    }
    $self->{'Config'} = $config;
    return (1, "Config updated");
  });

  $self->helper(LoadConstants => sub {
    my $json = `python3 $gui_home/static/constants.py`;
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

  # $self->plugin('SecureCORS');
  # Router
  my $r = $self->routes;

  $r->get('/')->to(cb => sub ($c) { $c->reply->static( 'index.html' ) });

  $r->post('/api/authenticate')->to('API#auth');

  $r->post('/api/settings')->to('API#settings');

  $r->post('/api/update')->to('API#update');

  $r->get('/api/config')->to('API#config');

  $r->post('/api/delete')->to('API#delete');

  $r->post('/api/toggle_enabled')->to('API#toggleEnabled');

  $r->any('/*')->to(cb => sub ($c) { $c->redirect_to('/') });
}

1;
