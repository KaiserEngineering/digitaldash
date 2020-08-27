package KEApp;
use Mojo::Base 'Mojolicious';
use JSON;

sub startup {
  my $self = shift;

  my $web_home = $ENV{'KEWebAppHome'} || '/opt/ke_webapp';
  my $gui_home = $ENV{'KEGUIHome'} || '/opt/DigitalDash_GUI';

  $self->config(hypnotoad => {listen => ['http://*:80'], proxy => 1, user => 'root'});
  $self->plugin('mason1_renderer', { interp_params  => { comp_root => "$web_home/templates/" } });

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
    my $json;
    {
      local $/; #Enable 'slurp' mode
      open my $fh, "<", "$gui_home/static/constants.json";
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

  $r->get('/home')->over(signed => 1)->to('App#home');

  $r->get('/settings')->over(signed => 1)->to('App#settings');

  $r->get('/edit')->over(signed => 1)->to('App#edit');

  $r->any('/')->to('App#login');

  $r->any('*whatever')->to('App#login');

}

1;
