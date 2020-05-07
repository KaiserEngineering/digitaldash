#!/usr/bin/env perl
use Mojolicious::Lite -signatures;
use JSON;


app->hook(after_dispatch => sub { 
    my $c = shift; 
    $c->res->headers->header('Access-Control-Allow-Origin' => '*'); 
    $c->res->headers->access_control_allow_origin('*');
    $c->res->headers->header('Access-Control-Allow-Methods' => 'GET, OPTIONS, POST, DELETE, PUT');
    $c->res->headers->header('Access-Control-Allow-Headers' => 'Content-Type' => 'application/x-www-form-urlencoded');
});

### START HELPERS

helper auth => sub {
    return { Name => 'Craig', Email => 'craig@kaiserengineering.io' };
};

### END HELPERS

get '/' => sub ($c) {
  $c->reply->static('index.html');
};

get '/api/user' => sub ($c) {
  $c->render(json => { Name => 'Craig', Email => 'craig@kaiserengineering.io' });
};

# Get our existing KE config
get '/api/config/' => sub ($c) {
  my $json;
  {
    local $/; #Enable 'slurp' mode
    open my $fh, "<", "/Users/craigkaiser/kaiserengineering/DigitalDash_GUI/etc/Config.json";
    $json = <$fh>;
    close $fh;
  }
  $c->render(json => JSON::from_json($json));
};

post '/api/update' => sub {
    my $c    = shift;
    my $json = JSON::decode_json( $c->req->params->to_hash->{config} );
    my $json_pretty = JSON::to_json( $json, { canonical => 1, pretty => 1 });
    {
      local $/; #Enable 'slurp' mode
      open my $fh, ">", "/Users/craigkaiser/kaiserengineering/DigitalDash_GUI/etc/Config.json";
      print $fh $json_pretty;
      close $fh;
    }
    $c->redirect_to( '/');
};

app->start;
