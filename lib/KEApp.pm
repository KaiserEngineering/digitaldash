package KEApp;
use Mojo::Base 'Mojolicious';

sub startup {
  my $self = shift;

  $self->static->paths(['../']);
  
  $self->config(hypnotoad => {listen => ['http://*:3000'], proxy => 1, user => 'root'});

  my $config = $self->plugin('Config');
  $self->secrets($config->{secrets});

  # Router
  my $r = $self->routes;

  $r->get('/')->to('API#index');

  $r->post('/api/login')->to('API#login');

  $r->post('/api/current_user')->to('API#current_user');

  $r->get('/api/config/')->to('API#config');

  $r->post('/api/update/')->to('API#update');
}

1;
