#!/usr/bin/env perl
use Mojolicious::Lite -signatures;
use JSON;


### START HELPERS

helper auth => sub {
    return { Name => 'Craig', Email => 'craig@kaiserengineering.io' };
};

### END HELPERS

get '/' => sub ($c) {
  $c->render(template => 'index');
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

__DATA__

@@ index.html.ep
% layout 'default';
% title 'KE App';

<div id="app" class="container">

  <form method="POST" action="/api/update">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{ currentUser.Name }}'s KE Config
          </h1>
          <textarea name="config" class="textarea">{{ config }}</textarea><br/>

          <div class="card" v-for="view in config.views">
            <header class="card-header">
              <p class="card-header-title">
                {{view.name}}
              </p>
            </header>
            <div class="card-content">
              <div class="content">
                <label class="label">Theme:</label>
                <span class="value">
                  <h4>{{view.theme}}</h4>
                </span>

                <label class="label">Parameters:</label>
                <span class="value">
                  <h4>{{view.pids.toString()}}</h4>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button type="submit" class="button">Update</button>
    </section>
  </form>

</div>

%= javascript 'https://unpkg.com/vue/dist/vue.min.js'
%= javascript 'https://unpkg.com/axios/dist/axios.min.js'
%= javascript begin

var app = new Vue({
  el: '#app',
  created: function() {
    this.getConfig();
    this.getUser();
  },
  data: {
      config: {},
      currentUser : {}
  },
  methods: {
    getConfig: function() {
      var self = this;

      axios.get('/api/config').then(
        function(response) {
          self.config = response.data;
        }
      );
    },

    getUser: function() {
      var self = this;

      axios.get('/api/user').then(
        function(response) {
          self.currentUser = response.data;
        }
      );
    }
  }
});
% end
@@ layouts/default.html.ep
<!DOCTYPE html>
<html>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <head><title><%= title %></title></head>
  %= stylesheet 'bulma.min.css'

  <style>
    .label {
      font-size: 1.5em;
    }
    .value {
        word-break: break-all;
    }
  </style>

  <body><%= content %></body>
</html>
