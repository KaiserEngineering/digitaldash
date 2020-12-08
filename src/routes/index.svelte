<script context="module">
  export async function preload(page, session) {
    const response      = await this.fetch( '/api/config' );
    const configuration = await response.json();

    const res       = await this.fetch( '/api/constants' );
    const constants = await res.json();

    return { configuration: configuration, constants: constants };
  }
</script>

<script>
  import { session } from "$app/stores";
  import Notifications from '../components/Notifications.svelte';
  export let configuration;
  export let constants;

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
        <div class="card transparent img-fluid">
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
    background-color: #2196F3;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
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
</style>
