<script context="module">
  export async function load({ page, context }) {
    return { props: { id: page.params.slug } };
  }
</script>

<script>
  import { session } from "$app/stores";
  import Slider from "$lib/Slider.svelte";

  export let id;
  let configuration = $session.configuration;

  let view         = configuration.views[id];
  const KE_PID     = $session.constants.KE_PID;
  const UNIT_LABEL = $session.constants.PID_UNIT_LABEL;
  const pids       = Object.keys( KE_PID );
  const themes     = $session.constants.themes;
  let theme;
  if ( view && view.gauges.length > 0 ) {
    theme = view.gauges[0].theme
  }
  // Defining a new view?
  else {
    view = {
      "name": "",
      "enabled": true,
      "default": 0,
      "background": "",
      "alerts": [],
      "dynamic": {},
      "gauges": []
    }
  }

  function normalizeGauges(config=undefined) {
    let tempView = config ? config : view;

    if ( tempView ) {
      // Ensure we always have 3 entries in our array
      while ( tempView.gauges.length < 3 ) {
        tempView.gauges.push({
          "theme"       : "",
          "unit"        : "",
          "pid"         : ""
        });
      }
    }
    return tempView;
  }
  view = normalizeGauges();

  function pidChange( node ) {
    function getUnits( node ) {
      const pid = node.target.value;
      let pidRegex = /(gauge|dynamic|alert)-(\d+)/;
      let matches = pidRegex.exec(node.target.name);

      let type = matches[1],
        index = matches[2];

      if ( type == 'gauge' ) {
        view.gauges[index].pid = pid;
      }
      else if ( type == 'alert' ) {
        view.alerts[index].pid = pid;
      }
      else if ( type == 'dynamic' ) {
        view.dynamic.pid = pid;
      }

      // find our units for the provided pid
      let unitsSelect = node.srcElement.parentElement.nextSibling.nextSibling.querySelectorAll('[name=units]')[0]
      // Clear our old units from units select input
      let i = 0;
      for (i = 0; i < unitsSelect.options.length; i++) {
        unitsSelect.remove(i);
      }

      if ( !pid ) {
        unitsSelect.options[0] = new Option('-', '', false, false);
        return;
      }
      // Add our units to our select input
      Object.keys(KE_PID[pid].units).forEach((unit, i) => {
        let label = UNIT_LABEL[unit];

        unitsSelect.options[i] = new Option(label, unit, false, false);
      });
      // Actually set the select value to the first unit
      let currentValue = KE_PID[pid].units[ view.gauges[index].unit ];
      if ( currentValue ) {
        unitsSelect.value = view.gauges[index].unit;
      }
      else {
        unitsSelect.value = unitsSelect.options[0].value;
      }
      unitsSelect.focus();
      unitsSelect.blur();
    }
    node.addEventListener( "change", getUnits );
    // Set our initial values
    var event = new Event('change');
    node.dispatchEvent( event );

    return {
      destroy() {
        node.removeEventListener( "change", getUnits );
      }
    }
  }

  function handleSubmit(event) {
    // We need a seperate array to account for empty gauges
    let gauges = [];
    view.gauges.forEach((gauge, i) => {
      // Slip if we don't have a value for PID
      if ( gauge.pid ) {
          gauge.theme = theme;
          gauges.push(gauge);
      }
    });

    let tempView = view;
    tempView.gauges = gauges;
    configuration.views[id] = tempView;

    if ( configuration.views[id].dynamic && !configuration.views[id].pid ) {
       configuration.views[id].dynamic = {};
    }

    fetch("/api/config", {
        method : "POST",
        body   : JSON.stringify( configuration )
      })
      .then(d => d.json())
      .then(d => {
        $session.configuration = d.config;

        $session.actions = [{
          id    : $session.count,
          msg   : d.message,
          theme : d.ret ? 'alert-info' : 'alert-warning',
        }, ...$session.actions];
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

  function toggleDynamic() {
    view.dynamic.enabled = view.dynamic.enabled ? false : true;
  }
</script>

<div class="col-sm-12 col-sm-8 pb-4">
  {#if view}
  <div id="edit-container" class="container">
    <div class="col-sm-12 order-sm-1">
      <h4 class="mb-3">Editing view #{id}</h4>
      <form on:submit|preventDefault="{handleSubmit}" class="needs-validation">
        <input type="hidden" value="<%$id%>" name="id"/>

          <h4>Basics</h4>
          <hr/>

        <div class="basicsContainer">
          <div class="row">

            <div class="col-12">
              <label for="name">View name</label>
              <input bind:value={view.name} name="name" type="text" class="form-control" id="name" placeholder="" required>
            </div>

            <div class="col-6">
              <label for="background">Background</label>
              <select bind:value={view.background} name="background" class="custom-select form-control d-block w-100" id="country" required>
                <option value="">-</option>
                {#each ['banner1.jpg', 'bg.jpg', 'BlackBackground.png', 'CarbonFiber.png'] as background}
                <option value={background}>{background}</option>
                {/each}
              </select>
            </div>

            <div class="col-6">
              <label for="theme">Theme</label>
              <select bind:value={theme} name="theme" class="form-control d-block w-100" id="theme" required>
                {#each themes as theme}
                  <option value={theme}>{theme}</option>
                {/each}
              </select>
            </div>

            <div class="col-12">
              <label for="theme">Vehicle Parameters</label>
              <div class="input-group">
                {#each Array(3) as _, i}
                  <div class="col-4 pl-1 pr-1">
                    <div class="col-12">
                      <select use:pidChange name="gauge-{i}" value="{view.gauges[i].pid}" class="mb-2 form-control" id="pid-{id}">
                        <option value="">-</option>
                        {#each pids as pid}
                          <option value={pid}>
                            {KE_PID[pid].shortName ? KE_PID[pid].shortName : KE_PID[pid].name}
                          </option>
                        {/each}
                      </select>
                    </div>

                    <!-- Units for PID -->
                    <div class="col-12">
                      <select name="units" on:blur="{ e => view.gauges[i].unit = e.target.value }" value={view.gauges[i].unit} class="form-control"></select>
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

              <div class="input-group">
                <div class="col-sm-6 col-12 pl-1 pr-1">
                  <label class="label" for="alertMessage">Message</label>
                  <input required bind:value={alert.message} class="value form-control" type="text" name="alertMessage"/>
                </div>

                <div class="col-sm-3 col-12 pl-1 pr-1">
                  <label class="label" for="alertValue">Value</label>
                  <input required bind:value={alert.value} class="form-control" type="text" name="alertValue"/>
                </div>

                <div class="col-sm-3 col-12 pl-1 pr-1">
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

                <div class="col-sm-6 col-12 pl-1 pr-1">
                  <label class="label" for="alertPID">PID</label>

                  <select use:pidChange value={alert.pid} name="alert-{i}" class="value form-control pl-1 pr-1" id="alertPID" required>
                    <option value="">-</option>
                    {#each pids as pid}
                      <option value={pid}>
                        {pid ? KE_PID[pid].shortName ? KE_PID[pid].shortName : KE_PID[pid].name : ''}
                      </option>
                    {/each}
                  </select>
                </div>

                <div class="col-sm-3 col-12 pl-1 pr-1">
                  <label class="label" for="alertUnit">Unit</label>
                  <select name="units" on:blur="{ e => alert.unit = e.target.value }" value={alert.unit} class="form-control value" required><option>-</option></select>
                </div>

                <div class="col-sm-3 col-12 pl-1 pr-1">
                  <label class="label" for="alertPriority">Priority</label>
                  <input required bind:value={alert.priority} class="value form-control" type="number" name="alertPriority"/>
                </div>
              </div>

              <div class="mt-2 text-center">
                <button on:click="{() => {removeAlert( i )}}" class="form-control delete" type="button">Delete</button>
              </div>
            </div>
          {/each}

          <div class="col-sm-12 col-auto">
            <button class="form-control" on:click={() => addAlert()}>New alert</button>
          </div>
        </div>
        <!-- END ALERTS -->

        <h4>Dynamic</h4>
        <hr/>

        <div class="dynamicContainer">
          <div class="row">
            <div class="col-sm-3 col-12">
              <svelte:component this={Slider} callback={toggleDynamic} callbackArgs={null} checked={view.dynamic.enabled} />
            </div>
          </div>
          <div class="row">

            <div class="col-sm-3 col-12">
              <label for="dynamicPID">PID</label>

              <select use:pidChange value={view.dynamic.pid} disabled={!view.dynamic.enabled} name="dynamic-{0}" class="form-control" id="dynamicPID" required>
                <option value="">-</option>
                {#each pids as pid}
                  <option value={pid}>
                    {KE_PID[pid].shortName ? KE_PID[pid].shortName : KE_PID[pid].name}
                  </option>
                {/each}
              </select>
            </div>

            <div class="col-sm-3 col-12">
              <label class="label" for="dynamicUnit">Unit</label>
              <select name="units" disabled={!view.dynamic.enabled} on:blur="{ e => view.dynamic.unit = e.target.value }" value={view.dynamic.unit} class="form-control value" required><option>-</option></select>
            </div>

            <div class="col-sm-3 col-12">
              <label for="dynamicValue">Value</label>
              <input bind:value={view.dynamic.value} disabled={!view.dynamic.enabled} class="form-control" type="text" name="dynamicValue"/>
            </div>

            <div class="col-sm-3 col-12">
              <label for="dynamicOP">OP</label>
              <select bind:value={view.dynamic.op} name="dynamicOP" disabled={!view.dynamic.enabled} class="form-control">
                <option value="">-</option>
                {#each ['=', '>', '<', '>=', '<='] as op}
                  <option value={op}>
                    {op}
                  </option>
                {/each}
              </select>
            </div>

            <div class="col-sm-3 col-12">
              <label for="dynamicPriority">Priority</label>
              <input bind:value={view.dynamic.priority} disabled={!view.dynamic.enabled} class="form-control" type="number" name="dynamicPriority"/>
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
