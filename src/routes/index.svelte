<script>
  import { session } from "$app/stores";
  import Slider from "$lib/Slider.svelte";

  let KE_PIDS = $session.constants.KE_PID;
  $: views = $session.configuration.views;

  $: {
    if ( views && Object.keys( views ).length < 2 ) {
      views[1] = {
        "name": "Default",
        "enabled": false,
        "default": 0,
        "background": "bg.jpg",
        "alerts": [],
        "dynamic": {},
        "gauges": []
      };
    }
  };

  function toggleEnabled( id ) {
    if ( views[id].gauges[0] ) {
      fetch("./api/config", {
          method : "PUT",
          headers: {
            'Content-Type': 'application/json',
          },
          body   : JSON.stringify({id: id})
      }).then(d => d.json())
      .then(d => {
        views = d.views.views;
        $session.configuration.views = d.views.views;
        $session.actions = [{
          id    : $session.count,
          msg   : d.message,
          theme : d.ret ? 'alert-info' : 'alert-warning',
        }, ...$session.actions];
      });
      return false;
    }
    else {
      $session.actions = [{
        id    : $session.count,
        msg   : "Set-up this view to enable it!",
        theme : 'alert-info',
      }, ...$session.actions];
      return true;
    }
  }
</script>

{#if views}
  <div class="container col-sm-10 col-md-6 pr-4 pl-4">
    <h1>KE Digital Dash</h1>
    <p>Select a gauge layout to edit the configuration</p>
  </div>
  {#each Object.keys(views) as id }
    <div class="container col-sm-10 col-md-6 pr-4 pl-4">
      <div class="card">
        <div class="row m-2">
          <div class="text-left col-6">
            <h5>{views[id].name}</h5>
          </div>
          <div class="text-right col-6">
            <svelte:component this={Slider} callback={toggleEnabled} callbackArgs={id} checked={views[id].enabled} />
          </div>
        </div>

        <a href="/edit/{id}">

          <div class="card transparent">
            <img class="background-preview" src="images/Background/{views[id].background}" alt="view background">

            <div class="row card-img-overlay">

            <div class="col-6 text-left">
              {#if views[id].gauges[0]}
                <img class="mx-4 image-overlay my-auto" src="images/{views[id].gauges[0].theme}/preview.png">
              {/if}
            </div>

              <div class="col-6 d-flex flex-column justify-content-center">
                {#each views[id].gauges as gauge}
                  {#if gauge && gauge.pid}
                    <div class="text-center">
                      <p class="pid">{ KE_PIDS[ gauge.pid ] ? KE_PIDS[ gauge.pid ].shortName ? KE_PIDS[ gauge.pid ].shortName : "Undefined" : "Undefined" }</p>
                    </div>
                  {/if}
                {/each}
              </div>

            </div>
          </div>
        </a>
    </div>
   </div>
  {/each}
{/if}

<style>
  img {
    border-radius: 25px;
  }
  .transparent {
    border: transparent;
    background-color: transparent;
  }

  .pid {
    background-color: #FF4D4D;
    border-radius: 0.5em;
    padding: 2px;
    color: white;
    font-size:calc(100% + 1.1vw);
  }

  .image-overlay {
    width: 50%;
    position: absolute;
    top: 25%;
    right: 0;
    bottom: 25%;
    left: 0;
    padding: 1rem;
    border-radius: calc(.25rem - 1px);
  }

  .background-preview {
    height: 13em;
  }

  .card {
    border-radius: 20px;
    padding: 0.5em;
    margin-top: 1em;
  }

</style>
