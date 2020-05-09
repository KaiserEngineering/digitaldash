package KEApp;
use Mojo::Base 'Mojolicious';

sub startup {
  my $self = shift;

  $self->config(hypnotoad => {listen => ['http://*:3000'], proxy => 1, user => 'root'});

  my $config = $self->plugin('Config');
  $self->secrets($config->{secrets});

  $self->plugin('SecureCORS');
  $self->routes->to('cors.origin' => '*');

  # Router
  my $r = $self->routes;

  $r->get('/')->to('api#index');

  $r->post('/api/login')->to('api#login');

  $r->post('/api/current_user')->to('api#current_user');

  $r->get('/api/config/')->to('api#config');

  $r->post('/api/update/')->to('api#update');

  $r->get('/Users/craigkaiser/kaiserengineering/DigitalDash_GUI/static/imgs/Stock/gauge.png')->to('api#image');
}

1;
