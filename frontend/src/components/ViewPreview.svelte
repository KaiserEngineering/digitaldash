<script lang="ts">
    import Slider from "$components/Slider.svelte";
    import { enhance } from "$app/forms";
    import { getContext } from "svelte";
    import { keys } from "$lib/Keys";
    import { page } from "$app/stores";

    export let id: string;
    export let view: any;

    const { session } = getContext(keys.session);
    const KE_PIDS = $page.data.locals.constants.KE_PID;

    function handleFormSubmissionResults(result: any) {
        if (result?.data?.config) {
            $session.configuration = result.data.config;
        }

        result.data.id = $session.count;
        $session.actions = [result.data];
    }
</script>

<form
    method="POST"
    action="?/toggle_enabled"
    class="container col-sm-10 col-md-6 pr-4 pl-4"
    use:enhance={() => {
    return async ({ result }) => {
        handleFormSubmissionResults(result);
    };
    }}
>
    <input name="id" value={id} type="hidden" />
    <input
        name="config"
        value={JSON.stringify($session.configuration)}
        type="hidden"
    />
    
    <div class="row m-2">
        <div class="text-left col-6">
        <h5>{view.name}</h5>
        {#if view.default}
            (Default view)
        {/if}
        </div>

        <div class="text-right d-flex flex-row col-6">        
            <button
                class="slider-button"
                type="submit"
                data-toggle="tooltip"
                title="Enable/Disable this view"
            >
                <svelte:component this={Slider} {id} />
            </button>
        </div>
    </div>

    <a href="/edit/{id}">
        <div class="card transparent">
        <img
            class="background-preview"
            src="images/Background/{view.background}"
            alt="view background"
        />

        <div class="row card-img-overlay">
            <div class="col-6 text-left">
            {#if view.gauges[0]}
                <img
                class="m-4 image-overlay my-auto"
                src="images/{view.gauges[0].theme}/preview.png"
                alt="gauge preview"
                />
            {/if}
            </div>

            <div class="col-6 d-flex flex-column justify-content-center">
            {#each view.gauges as gauge}
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
</form>

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
      padding: 3%;
      margin: 4%;
      color: white;
      font-size: 80%;
    }
  
    .image-overlay {
      max-width: 40%;
      position: absolute;
      top: 25%;
      right: 0;
      bottom: 25%;
      left: 0;
      padding: 1rem;
      border-radius: calc(0.25rem - 1px);
    }
  
    .background-preview {
      max-height: 30em;
    }
  
    .card {
      border-radius: 20px;
      padding: 0.5em;
      margin-top: 1em;
    }
    .slider-button {
      background: none;
      color: inherit;
      border: none;
      padding: 0;
      font: inherit;
      cursor: pointer;
      outline: inherit;
    }
  </style>
  