<script>
  import { session } from "$app/stores";
  import { _ } from "lodash";
  import Slider from "../components/Slider";

  let KE_PIDS = $session.constants.KE_PID;
  $: views = $session.configuration.views;

  function toggleEnabled( id ) {
    fetch("./api/config", {
        method : "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body   : JSON.stringify({id: id})
    }).then(d => d.json())
    .then(d => {
      if ( !_.isEqual( views, d.views )) {
        views = d.views.views;
        $session.configuration.views = d.views.views;
      }
      $session.actions = [{
        id    : $session.count,
        msg   : d.message,
        theme : d.ret ? 'alert-info' : 'alert-warning',
      }, ...$session.actions];
    });
  }
</script>

{#if views}
  {#each Object.keys(views) as id }
    <div class="container col-sm-10 col-md-6 pr-4 pl-4">

      <div class="row m-2">
        <div class="text-left col-6">
          <h5>{views[id].name}</h5>
        </div>
        <div class="text-right col-6">
          <Slider callback={toggleEnabled} callbackArgs={id} checked={views[id].enabled} />
        </div>
      </div>

      <a href="/edit/{id}">

        <div class="card transparent">
          <img class="card-img-top" src="images/Background/{views[id].background}" alt="view background">

          <div class="row card-img-overlay">

            <div class="col-6 text-left">
              <img class="image-overlay" src="images/{views[id].theme}/needle.png">
              <img class="image-overlay" src="images/{views[id].theme}/gauge.png">
            </div>

            <div class="col-6 d-flex flex-column justify-content-center">
              {#each views[id].gauges as gauge}
              <div class="text-center">
                <p class="pid">{KE_PIDS[ gauge.pid ].shortName ? KE_PIDS[ gauge.pid ].shortName : KE_PIDS[ gauge.pid ].name }</p>
              </div>
              {/each}
            </div>

          </div>
        </div>
      </a>
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
</style>
