<script lang="ts">
  import { page } from "$app/stores";
  import { keys } from "$lib/Keys";
  import { getContext } from "svelte";

  const { session } = getContext(keys.session);

  import Slider from "$components/Slider.svelte";
  import { enhance } from "$app/forms";

  let KE_PIDS = $page.data.locals.constants.KE_PID;
  $: views = $session.configuration.views;

  $: {
    if (views && Object.keys(views).length < 2) {
      views[1] = {
        name: "Default",
        enabled: false,
        default: 0,
        background: "bg.jpg",
        alerts: [],
        dynamic: {},
        gauges: [],
      };
    }
  }
</script>

{#if views}
  <div class="container col-sm-10 col-md-6 pr-4 pl-4">
    <h1>KE Digital Dash</h1>
    <p>Select a gauge layout to edit the configuration</p>
  </div>
  {#each Object.keys(views) as id}
    <form
      method="POST"
      action="?/toggle_enabled"
      class="container col-sm-10 col-md-6 pr-4 pl-4"
      use:enhance={() => {
        return async ({ result }) => {
          if (result.data.config) {
            $session.configuration = result.data.config;
          }

          result.data.id = $session.count;
          $session.actions = [result.data];
        };
      }}
    >
      <input name="id" value={id} type="hidden" />
      <input
        name="config"
        value={JSON.stringify($session.configuration)}
        type="hidden"
      />

      <div class="card" formaction="?/toggle_enabled">
        <div class="row m-2">
          <div class="text-left col-6">
            <h5>{views[id].name}</h5>
          </div>
          <div class="text-right col-6">
            <button
              class=""
              type="submit"
              data-toggle="tooltip"
              title="Enable/Disable this view"
            >
              <svelte:component
                this={Slider}
                {id}
                formaction="?/toggle_enabled"
              />
            </button>
          </div>
        </div>

        <a href="/edit/{id}">
          <div class="card transparent">
            <img
              class="background-preview"
              src="images/Background/{views[id].background}"
              alt="view background"
            />

            <div class="row card-img-overlay">
              <div class="col-6 text-left">
                {#if views[id].gauges[0]}
                  <img
                    class="mx-4 image-overlay my-auto"
                    src="images/{views[id].gauges[0].theme}/preview.png"
                    alt="gauge preview"
                  />
                {/if}
              </div>

              <div class="col-6 d-flex flex-column justify-content-center">
                {#each views[id].gauges as gauge}
                  {#if gauge && gauge.pid}
                    <div class="text-center">
                      <p class="pid">
                        {KE_PIDS[gauge.pid]
                          ? KE_PIDS[gauge.pid].shortName
                            ? KE_PIDS[gauge.pid].shortName
                            : "Undefined"
                          : "Undefined"}
                      </p>
                    </div>
                  {/if}
                {/each}
              </div>
            </div>
          </div>
        </a>
      </div>
    </form>
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
    background-color: #ff4d4d;
    border-radius: 0.5em;
    padding: 2px;
    color: white;
    font-size: calc(100% + 1.1vw);
  }

  .image-overlay {
    width: 50%;
    position: absolute;
    top: 25%;
    right: 0;
    bottom: 25%;
    left: 0;
    padding: 1rem;
    border-radius: calc(0.25rem - 1px);
  }

  .background-preview {
    height: 13em;
  }

  .card {
    border-radius: 20px;
    padding: 0.5em;
    margin-top: 1em;
  }
  button {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
  }
</style>
