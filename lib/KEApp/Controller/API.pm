package KEApp::Controller::API;
use Mojo::Base 'Mojolicious::Controller';


sub config {
  my $c = shift;

  $c->app->LoadConfig();

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

sub edit {
  my $c = shift;

  my $id = @{$c->every_param('id')}[0];

  $c->render( "edit.html", handler => 'mason', id => $id);
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
