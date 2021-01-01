<script>
  import { session } from "$app/stores";
  import { _ } from "lodash";

  let KE_PIDS = $session.constants.KE_PID;

  let views = $session.configuration.views;

  function ToggleEnabled( id ) {
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
      }
      $session.actions = [ d.message, ...$session.actions ];
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
          <label class="switch">
            <input on:click|preventDefault="{() => {ToggleEnabled(id)}}" type="checkbox" checked={views[id].enabled ? "checked" : ''}>
            <span class="slider round"></span>
          </label>
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
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: #FF4D4D;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #FF4D4D;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
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
