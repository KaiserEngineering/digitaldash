<Notifications {actions} />

{#await promise}
  <p>...waiting</p>
  {:then}
  <div id="edit-container" class="container mb-4">
    <div class="col-md-12 order-md-1">
      {#if id == 'new'}
      <h4 class="mb-3">Creating new view</h4>
      {:else}
      <h4 class="mb-3">Editing view #{id}</h4>
      {/if}
      <form on:submit|preventDefault="{handleSubmit}" class="needs-validation">
        <input type="hidden" value="<%$id%>" name="id"/>

        <div class="col-12">
          <h4>Basics</h4>
          <hr/>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="name">View name</label>
            <input bind:value={view.name} name="name" type="text" class="form-control" id="name" placeholder="" required>
            <div class="invalid-feedback">
              View name is required
            </div>
          </div>
        </div>

        <div class="mb-3 row">
          <div class="col-6">
            <label for="background">Background</label>
            <div class="input-group">
              <select bind:value={view.background} name="background" class="custom-select form-control d-block w-100" required>
                <option value="">-</option>
                {#each ['banner1.jpg', 'bg.jpg', 'BlackBackground.png', 'CarbonFiber.png'] as background}
                <option value={background}>{background}</option>
                {/each}
              </select>
              <div class="invalid-feedback" style="width: 100%;">
                Background is required
              </div>
            </div>
          </div>
          <div class="col-6">
            <label for="theme">Theme</label>
            <div class="input-group">
              <select bind:value={view.theme} name="theme" class="form-control custom-select d-block w-100" id="theme" required>
                <option value="">-</option>
                {#each ['Stock'] as theme}
                <option value={theme}>{theme}</option>
                {/each}
              </select>
              <div class="invalid-feedback" style="width: 100%;">
                Theme is required
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          Vehicle Parameters
        </div>

        <div class="mb-3 row">
          {#each Array(3) as _, i}
          <div class="col-4">
            <div class="input-group">
              <select on:blur={updatePIDCount} value={id == 'new' ? '' : view.gauges[i].pid} name="pid{id}" class="form-control custom-select" id="pid{id}">
                <option value="">-</option>
                {#each pids as pid}
                <option value={pid}>
                  {KE_PID[pid].shortName ? KE_PID[pid].shortName : KE_PID[pid].name}
                </option>
                {/each}
              </select>
            </div>
          </div>
          {/each}
        </div>

        <div class="mt-3 col-12">
          <h4>Alerts</h4>

          {#each alerts as alert}
            <button class="form-control" on:click={() => { deleteAlert(alert) }} type="button">Delete alert</button>

            <div class="mb-3 row">
              <div class="col-md-3 col-12">
                <label for="alertMessage">Message</label>
                <input required value={alert.message} class="form-control" type="text" name="alertMessage"/>
              </div>

              <div class="col-md-auto col-12">
                <label for="alertPID">PID</label>

                <select on:blur={updatePIDCount} value={alert.pid} name="pid{id}" class="form-control custom-select" id="alertPID" required>
                  <option value="">-</option>
                  {#each pids as pid}
                  <option value={pid}>
                    {KE_PID[pid].shortName ? KE_PID[pid].shortName : KE_PID[pid].name}
                  </option>
                  {/each}
                </select>
              </div>
  
              <div class="col-md-3 col-12">
                <label for="alertValue">Value</label>
                <input required value={alert.value} class="form-control" type="text" name="alertValue"/>
              </div>
  
              <div class="col-md-auto col-12">
                <label for="alertOP">OP</label>
                <select required value={alert.op} name="alertOP" class="form-control custom-select">
                  <option value="">-</option>
                  {#each ['=', '>', '<', '>=', '<='] as op}
                  <option value={op}>
                    {op}
                  </option>
                  {/each}
                </select>
              </div>
  
             <div class="col-md-auto col-12">
              <label for="alertPriority">Priority</label>
              <input required value={alert.priority} class="form-control" type="number" name="alertPriority"/>
             </div>
  
             <div class="col-md-auto col-12">
              <label for="alertUnit">Unit</label>
              <input required value={alert.unit} class="form-control" type="text" name="alertUnit"/>
             </div>
            </div>
  
            <hr/>
          {/each}
  
          <div class="col-md-1 col-auto">
            <button class="form-control" on:click={addAlert}>New alert</button>
          </div>
        </div>

        <div class="mt-3 col-12">
          <h4>Dynamic</h4>
          <hr/>
        </div>

        <div class="mb-3 row">

          <div class="col-md-auto col-12">
            <label for="dynamicPID">PID</label>

            <select on:blur={updatePIDCount} value={dynamic.pid} name="pid{id}" class="form-control custom-select" id="dynamicPID">
              <option value="">-</option>
              {#each pids as pid}
              <option value={pid}>
                {KE_PID[pid].shortName ? KE_PID[pid].shortName : KE_PID[pid].name}
              </option>
              {/each}
            </select>
          </div>

          <div class="col-md-auto col-12">
            <label for="dynamicValue">Value</label>
            <input value={dynamic.value} class="form-control" type="text" name="dynamicValue"/>
          </div>

          <div class="col-md-auto col-12">
            <label for="dynamicOP">OP</label>
            <select value={dynamic.op} name="dynamicOP" class="form-control custom-select">
              <option value="">-</option>
              {#each ['=', '>', '<', '>=', '<='] as op}
              <option value={op}>
                {op}
              </option>
              {/each}
            </select>
          </div>

          <div class="col-md-auto col-12">
            <label for="dynamicPriority">Priority</label>
            <input value={dynamic.priority} class="form-control" type="number" name="dynamicPriority"/>
          </div>

          <div class="col-md-auto col-12">
            <label for="dynamicUnit">Unit</label>
            <input value={dynamic.unit} class="form-control" type="text" name="dynamicUnit"/>
          </div>
        </div>

        <hr class="mb-4">
        <button class="btn btn-primary btn-lg btn-block" type="submit">{id == 'new' ? 'Create' : 'Update'}</button>

        {#if id != 'new'}
        <button on:click={deleteView} type="button" class="btn btn-danger btn-lg btn-block">Delete view</button>
        {/if}
      </form>
    </div>
  </div>
{/await}

<script>
  import { navigate } from "svelte-routing";
  import Notifications from '../components/Notifications.svelte';

  export let id;
  export let actions = [];

  let view      = {};
  let constants = {};
  let pids      = [];
  let KE_PID    = {};
  let alerts    = [];
  let dynamic   = {};

  async function getConfigs() {
    const res = await fetch("/api/config", {
        method : "get",
      });
      const data = await res.json();

      if (res.ok) {
        if ( id == 'new' ) {
          constants = data.constants;
          KE_PID    = constants.KE_PID;
          pids      = Object.keys( KE_PID );
          view.id   = 'new'
        }
        else {
          view      = data.views[id];
          constants = data.constants;
          KE_PID    = constants.KE_PID;
          pids      = Object.keys( KE_PID );
          alerts    = view.alerts;
          dynamic   = view.dynamic;
          view.id   = id;
        }
      } else {
        throw new Error(data);
      }
    }

  let promise = getConfigs(); 

  function handleSubmit(event) {
    fetch("/api/update", {
        method      : "POST",
        mode        : 'cors',
        credentials : 'same-origin',
        body: JSON.stringify(view)
      })
      .then(d => d.json())
      .then(d => {
        actions = [d.message];
      });
  }

  function addAlert() {
    alerts = [...alerts, {
      "message" : "",
      "op"      : "",
      "priority": "",
      "unit"    : "",
      "value"   : "",
    }];
  }

  function updatePIDCount() {
    console.log('Chanigng PID')
  }

  function deleteAlert( delAlert ) {
    let tempArr = [];
    alerts.forEach( alert => {
      if ( delAlert != alert ) {
        tempArr.push( alert );
      }
      alerts = tempArr;
    });
  }

  function deleteView() {
    fetch("/api/delete", {
        method      : "POST",
        mode        : 'cors',
        credentials : 'same-origin',
        body: JSON.stringify(view)
      })
      .then(d => d.json())
      .then(d => {
        if ( d.res ) {
          navigate("/");
        }
        actions = [d.message];
      });
  }
</script>
