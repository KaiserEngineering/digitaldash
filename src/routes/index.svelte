<script context="module">
  export async function preload(page, session) {
    const response      = await this.fetch( '/api/config' );
    const configuration = await response.json();
    return { configuration };
  }
</script>

<script>
  import { session } from "$app/stores";
  import Notifications from '../components/Notifications.svelte';
  export let configuration;

  function ToggleEnabled( id ) {
    fetch("./api/config", {
        method : "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body   : JSON.stringify({id: id})
    }).then(d => d.json())
    .then(d => {
      configuration    = d.views;
      $session.actions = [ d.message, ...$session.actions ];
    });
  }
</script>

{#if configuration}
  {#each Object.keys(configuration.views) as id }
    <div class="container col-sm-10 col-md-6 pr-4 pl-4">
      <a href="/edit/{id}">
        <h5>{configuration.views[id].name}</h5>
        <div class="card img-fluid">
          <img class="card-img-top" src="images/{configuration.views[id].background}" alt="view background">

          <div class="card-img-overlay">
            <img src="images/{configuration.views[id].theme}.png" class="card-img-top" alt="...">
          </div>
        </div>
      </a>
      <div class="card-body text0-center">
        <label class="switch">
          <input on:change="{ToggleEnabled(id)}" type="checkbox" checked={configuration.views[id].enabled ? "checked" : ''}>
          <span class="slider round"></span>
        </label>
      </div>
    </div>
  {/each}
{/if}

<style>
  a {
    text-decoration: inherit;
    color: inherit;
  }
</style>
