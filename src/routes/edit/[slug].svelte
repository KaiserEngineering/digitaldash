<script context="module">
  export async function preload({ params, query }) {
    const id = params.slug;

    const response      = await this.fetch( '/api/config' );
    const configuration = await response.json();

    const res       = await this.fetch( '/api/constants' );
    const constants = await res.json();

    return { id: id, configuration: configuration, constants: constants };
  }
</script>

<script>
  import { session } from "$app/stores";

  export let id;
  export let configuration;
  export let constants;

  let actions = [];
  let view    = configuration ? configuration.views[id] : false;
  let KE_PID  = constants.KE_PID;
  let pids    = Object.keys( KE_PID );
  view.id     = id;

  function handleSubmit(event) {
    // Here we need to sanitize our input :/
    let gauges = [];
    view.gauges.forEach( pid => {
      gauges.push({
        "module"      : "Radial",
        "themeConfig" : "120",
        "unit"        : "PID_UNITS_RPM",
        "path"        : "/"+view.theme+"/",
        "pid"         : pid.pid
      });
    });
    view.gauges  = gauges;
    configuration.views[id] = view;

    fetch("/api/config", {
        method : "POST",
        body   : JSON.stringify( configuration )
      })
      .then(d => d.json())
      .then(d => {
        $session.actions = [ d.message, ...$session.actions ];
      });
  }

  function addAlert() {
    view.alerts = [...view.alerts, {
      "message" : "",
      "op"      : "",
      "priority": "",
      "unit"    : "",
      "value"   : "",
    }];
  }

  function removeAlert( index ) {
    let tempArr = view.alerts;
    tempArr.splice( index, 1 );

    view.alerts = tempArr;
  }
</script>

<div class="col-sm-12 col-md-8 pb-4">
  {#if view}
  <div id="edit-container" class="container">
    <div class="col-md-12 order-md-1">
      <h4 class="mb-3">Editing view #{id}</h4>
      <form on:submit|preventDefault="{handleSubmit}" class="needs-validation">
        <input type="hidden" value="<%$id%>" name="id"/>

          <h4>Basics</h4>
          <hr/>

        <div class="basicsContainer">
          <div class="row">

            <div class="col-md-6">
              <label for="name">View name</label>
              <input bind:value={view.name} name="name" type="text" class="form-control" id="name" placeholder="" required>
            </div>

            <div class="col-6">
              <label for="background">Background</label>
              <div class="input-group">
                <select bind:value={view.background} name="background" class="custom-select form-control d-block w-100" id="country" required>
                  <option value="">-</option>
                  {#each ['banner1.jpg', 'bg.jpg', 'BlackBackground.png', 'CarbonFiber.png'] as background}
                  <option value={background}>{background}</option>
                  {/each}
                </select>
              </div>
            </div>

            <div class="col-6">
              <label for="theme">Theme</label>
              <div class="input-group">
                <select bind:value={view.theme} name="theme" class="form-control d-block w-100" id="theme" required>
                  <option value="">-</option>
                  {#each ['Stock'] as theme}
                  <option value={theme}>{theme}</option>
                  {/each}
                </select>
              </div>
            </div>

            <div class="col-12">
              <label for="theme">Vehicle Parameters</label>
              <div class="input-group row">
                {#each Array(3) as _, i}
                  <div class="col-4">
                    <div class="input-group">
                      <select value={view.gauges[i].pid} name="pid{id}" class="form-control" id="pid{id}">
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
            </div>
          </div>
        </div>
        <!-- END BASICS -->

        <h4>Alerts</h4>
        <hr/>

        <div class="alertsContainer">
          {#each view.alerts as alert, i}
            <div class="alertContainer">
              <div class="row">

                <div class="col-md-6 col-12">
                  <label for="alertMessage">Message</label>
                  <input required bind:value={alert.message} class="form-control" type="text" name="alertMessage"/>
                </div>

                <div class="col-md-6 col-12">
                  <label for="alertPID">PID</label>

                  <select bind:value={alert.pid} name="pid{id}" class="form-control" id="alertPID" required>
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
                  <input required bind:value={alert.value} class="form-control" type="text" name="alertValue"/>
                </div>

                <div class="col-md-3 col-12">
                  <label for="alertOP">OP</label>
                  <select required bind:value={alert.op} name="alertOP" class="form-control">
                    <option value="">-</option>
                    {#each ['=', '>', '<', '>=', '<='] as op}
                    <option value={op}>
                      {op}
                    </option>
                    {/each}
                  </select>
                </div>

                <div class="col-md-3 col-12">
                  <label for="alertPriority">Priority</label>
                  <input required bind:value={alert.priority} class="form-control" type="number" name="alertPriority"/>
                </div>

                <div class="col-md-3 col-12">
                  <label for="alertUnit">Unit</label>
                  <input required bind:value={alert.unit} class="form-control" type="text" name="alertUnit"/>
                </div>

                <div class="mt-2 text-center">
                  <button on:click="{() => {removeAlert( i )}}" class="form-control delete" type="button">Delete</button>
                </div>
              </div>
            </div>
          {/each}

          <div class="col-md-12 col-auto">
            <button class="form-control" on:click={() => addAlert()}>New alert</button>
          </div>
        </div>
        <!-- END ALERTS -->

        <h4>Dynamic</h4>
        <hr/>

        <div class="dynamicContainer">
          <div class="row">

            <div class="col-md-3 col-12">
              <label for="dynamicPID">PID</label>

              <select bind:value={view.dynamic.pid} name="pid{id}" class="form-control" id="dynamicPID" required>
                <option value="">-</option>
                {#each pids as pid}
                  <option value={pid}>
                    {KE_PID[pid].shortName ? KE_PID[pid].shortName : KE_PID[pid].name}
                  </option>
                {/each}
              </select>
            </div>

            <div class="col-md-3 col-12">
              <label for="dynamicValue">Value</label>
              <input required bind:value={view.dynamic.value} class="form-control" type="text" name="dynamicValue"/>
            </div>

            <div class="col-md-3 col-12">
              <label for="dynamicOP">OP</label>
              <select required bind:value={view.dynamic.op} name="dynamicOP" class="form-control">
                <option value="">-</option>
                {#each ['=', '>', '<', '>=', '<='] as op}
                  <option value={op}>
                    {op}
                  </option>
                {/each}
              </select>
            </div>

            <div class="col-md-3 col-12">
              <label for="dynamicPriority">Priority</label>
              <input required bind:value={view.dynamic.priority} class="form-control" type="number" name="dynamicPriority"/>
            </div>

            <div class="col-md-3 col-12">
              <label for="dynamicUnit">Unit</label>
              <input required bind:value={view.dynamic.unit} class="form-control" type="text" name="dynamicUnit"/>
            </div>
          </div>
        </div>

        <hr class="mb-4">
        <button class="btn btn-primary btn-lg btn-block" type="submit">Update</button>

      </form>
    </div>
  </div>
  {/if}
</div>

<style>
  .basicsContainer {
    /* padding: 5px;
    border:turquoise;
    border-width: 2px;
    border-style: solid; */
  }

  .alertsContainer {
    /* padding: 5px;
    border:rgb(101, 145, 140);
    border-width: 2px;
    border-style: solid; */
  }

  .alertContainer {
    padding: 5px;
    margin: 5px;
    border-radius: 0.5em;
    border:grey;
    border-width: 1px;
    border-style: solid;
  }

  .dynamicContainer {
    /* padding: 5px;
    border:rgb(104, 232, 104);
    border-width: 2px;
    border-style: solid; */
  }

  .delete {
    background-color: rgb(220, 176, 176);
  }
</style>
