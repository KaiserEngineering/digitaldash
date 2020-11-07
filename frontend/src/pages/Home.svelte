<Notifications {actions} />

{#await promise}
  <p>...waiting</p>
  {:then}
    {#each Object.keys(configurations.views) as id }
    
      <div class="container col-sm-10 col-md-6 pr-4 pl-4">
        <Link to="/edit/{id}">
          <h5>{configurations.views[id].name}</h5>
          <div class="card img-fluid">
            <img class="card-img-top" src="images/{configurations.views[id].background}" alt="view background">

            <div class="card-img-overlay">
              <img src="images/{configurations.views[id].theme}.png" class="card-img-top" alt="...">
            </div>
          </div>
        </Link>
        <div class="card-body text0-center">
          <label class="switch">
            <input on:change="{ToggleEnabled(id)}" type="checkbox" checked={configurations.views[id].enabled ? "checked" : ''}>
            <span class="slider round"></span>
          </label>
        </div>
      </div>
    {/each}
  {:catch error}
    <p style="color: red">{error.message}</p>  
{/await}

<script>
  import Notifications from '../components/Notifications.svelte';
  import { Link } from "svelte-routing";

  let actions = [];

  let configurations = {};
  async function getConfigs() {
    const res = await fetch("./api/config", {
        method : "get",
      });
      const data = await res.json();

      if (res.ok) {
        configurations = data;
        return data;
      } else {
        throw new Error(data);
      }
    }
    let promise = getConfigs();

  function ToggleEnabled(id) {
    fetch("./api/toggle_enabled", {
        method : "post",
        body   : JSON.stringify({id: id})
    }).then(d => d.json())
    .then(d => {
      configurations.views = d.views;
      actions = [d.message];
    });
  }
</script>
