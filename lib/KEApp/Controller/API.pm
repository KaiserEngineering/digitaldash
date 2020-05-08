package KEApp::Controller::Api;
use Mojo::Base 'Mojolicious::Controller';
use JSON;

sub index {
  my $c  = shift;
  $c->reply->static('index.html');
}

sub login {
  my $c = shift;

  $c->render(json => { Name => 'Craig', Email => 'craig@kaiserengineering.io' });
}

sub current_user {
  my $c = shift;

  $c->render(json => { Name => 'Craig', Email => 'craig@kaiserengineering.io' });
}


sub config {
  my $c = shift;

  my $json;
  {
    local $/; #Enable 'slurp' mode
    open my $fh, "<", "/Users/craigkaiser/kaiserengineering/DigitalDash_GUI/etc/Config.json";
    $json = <$fh>;
    close $fh;
  }
  $c->render(json => JSON::from_json($json));
}

sub update {
  my $c = shift;

  my $json = JSON::decode_json( $c->req->params->to_hash->{config} );
  my $json_pretty = JSON::to_json( $json, { canonical => 1, pretty => 1 });
  {
    local $/; #Enable 'slurp' mode
    open my $fh, ">", "/Users/craigkaiser/kaiserengineering/DigitalDash_GUI/etc/Config.json";
    print $fh $json_pretty;
    close $fh;
  }
  $c->redirect_to( '/');
}

sub image {
  my $c   = shift;
  my $src = $c->req;

  $c->reply->static('gauge.png');
}

1;
