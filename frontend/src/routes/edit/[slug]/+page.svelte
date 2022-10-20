<script lang="ts">
  import { page } from "$app/stores";
  import Slider from "$components/Slider.svelte";
  import type { PageData } from "./$types";
  import { keys } from "$lib/Keys";
  import { getContext } from "svelte";
  import type { ActionData } from "./$types";
  import { enhance } from "$app/forms";

  const { session } = getContext(keys.session);

  export let data: PageData;

  let view = $session.configuration.views[data.id];

  const KE_PID = $page.data.locals.constants.KE_PID;
  const UNIT_LABEL = $page.data.locals.constants.PID_UNIT_LABEL;
  const pids = Object.keys(KE_PID);
  const themes = $page.data.locals.constants.themes || [];
  let theme: string = "";
  if (view && view.gauges.length > 0) {
    theme = view.gauges[0].theme;
  }
  // Defining a new view?
  else {
    view = {
      name: "",
      enabled: true,
      default: 0,
      background: "",
      alerts: [],
      dynamic: {},
      gauges: [],
    };
  }

  function normalizeGauges(config = undefined) {
    let temp = config ? config : view;

    if (temp) {
      // Ensure we always have 3 entries in our array
      while (temp.gauges.length < 3) {
        temp.gauges.push({
          theme: undefined,
          unit: undefined,
          pid: undefined,
        });
      }
    }
    return temp;
  }
  view = normalizeGauges();

  function getUnits(node: {
    target: { value: any; name: string };
    srcElement: {
      parentElement: {
        nextSibling: {
          nextSibling: { querySelectorAll: (arg0: string) => any[] };
        };
      };
    };
  }) {
    const pid = node.target.value;
    let pidRegex = /(gauge|dynamic|alert)-(\d+)/;
    let matches = pidRegex.exec(node.target.name);

    let type = matches[1],
      index = matches[2];

    if (view.gauges[index] && view.gauges[index].pid) {
      if (type == "gauge") {
        view.gauges[index].pid = pid;
      } else if (type == "alert") {
        view.alerts[index].pid = pid;
      } else if (type == "dynamic") {
        view.dynamic.pid = pid;
      }
    } else {
      view.gauges[index] = { pid: pid };
    }

    // find our units for the provided pid
    let unitsSelect =
      node.srcElement.parentElement.nextSibling.nextSibling.querySelectorAll(
        "[name=units]"
      )[0];
    // Clear our old units from units select input
    let i = 0;
    for (i = 0; i < unitsSelect.options.length; i++) {
      unitsSelect.remove(i);
    }

    if (!pid) {
      unitsSelect.options[0] = new Option("-", "", false, false);
      return;
    }
    // Add our units to our select input
    Object.keys(KE_PID[pid].units).forEach((unit, i) => {
      let label = UNIT_LABEL[unit];

      unitsSelect.options[i] = new Option(label, unit, false, false);
    });
    // Actually set the select value to the first unit
    let currentValue;
    let unit;
    if (view.gauges[index]) {
      if (type == "gauge") {
        currentValue = KE_PID[pid].units[view.gauges[index].unit];
        unit = view.gauges[index].unit;
      } else if (type == "alert") {
        currentValue = KE_PID[pid].units[view.alerts[index].unit];
        unit = view.alerts[index].unit;
      } else if (type == "dynamic") {
        currentValue = KE_PID[pid].units[view.dynamic.unit];
        unit = view.dynamic.unit;
      }

      if (currentValue) {
        unitsSelect.value = unit;
      } else {
        unitsSelect.value = unitsSelect.options[0].value;
      }
      unitsSelect.focus();
      unitsSelect.blur();
    }
  }

  function pidChange(node: HTMLSelectElement) {
    node.addEventListener("change", getUnits);
    // Set our initial values
    var event = new Event("change");
    node.dispatchEvent(event);

    return {
      destroy() {
        node.removeEventListener("change", getUnits);
      },
    };
  }

  function addAlert() {
    view.alerts = [
      ...view.alerts,
      {
        message: "",
        op: "",
        priority: "",
        unit: "",
        value: "",
      },
    ];
  }

  function removeAlert(index: number) {
    let tempArr = view.alerts;
    tempArr.splice(index, 1);

    view.alerts = tempArr;
  }

  export let form: ActionData;
  if (form) {
    form.id = $session.count;
    $session.actions.push(form);
  }
</script>

<form method="POST" class="col-sm-12 col-sm-8 pb-4" use:enhance>
  {#if view}
    <div id="edit-container" class="container">
      <div class="col-sm-12 order-sm-1">
        <h4 class="mb-3">Editing view #{data.id}</h4>
        <form method="POST" class="needs-validation">
          <input type="hidden" value={data.id} name="id" />

          <h4>Basics</h4>
          <hr />

          <div class="basicsContainer">
            <div class="row">
              <div class="col-12">
                <label for="name">View name</label>
                <input
                  value={view.name}
                  name="basics-name"
                  type="text"
                  class="form-control"
                  id="name"
                  placeholder=""
                  required
                />
              </div>

              <div class="col-6">
                <label for="background">Background</label>
                <select
                  value={view.background}
                  name="basics-background"
                  class="custom-select form-control d-block w-100"
                  id="background"
                  required
                >
                  <option value="">-</option>
                  {#each ["Black.png", "Blue Purple Gradient.png", "Carbon Fiber.png", "Galaxy.png", "Digital Camo.png", "Flare.png", "Jellyfish.png", "Red.png"] as background}
                    <option value={background}
                      >{background.replace(/\.png|\.jpg/, "")}</option
                    >
                  {/each}
                </select>
              </div>

              <div class="col-6">
                <label for="theme">Theme</label>
                <select
                  value={theme}
                  name="theme"
                  class="form-control d-block w-100"
                  id="theme"
                  required
                >
                  {#each themes as theme}
                    <option value={theme}>{theme}</option>
                  {/each}
                </select>
              </div>

              <div class="col-12">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>Vehicle Parameters</label>
                <div class="input-group">
                  {#each Array(3) as _, i}
                    <div class="col-4 pl-1 pr-1">
                      <div class="col-12">
                        <select
                          use:pidChange
                          name="gauge-pid-{i}"
                          value={view.gauges[i].pid}
                          class="mb-2 form-control"
                          id="pid-{i}"
                        >
                          <option value="">-</option>
                          {#each pids as pid}
                            <option value={pid}>
                              {KE_PID[pid].shortDesc
                                ? KE_PID[pid].shortDesc
                                : "Undefined"}
                            </option>
                          {/each}
                        </select>
                      </div>

                      <!-- Units for PID -->
                      <div class="col-12">
                        <select
                          name="gauge-unit-{i}"
                          value={view.gauges[i].unit}
                          class="form-control"
                        />
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            </div>
          </div>

          <div class="col-12">
            <div class="form-check">
              <input
                id="dynamicMinMax"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Show default min/max values or show dynamic values based on observed min max"
                class="form-check-input"
                type="checkbox"
                checked={view.dynamicMinMax}
              />
              <label class="form-check-label" for="dynamicMinMax">
                Observed Min/Max
              </label>
            </div>
          </div>

          <!-- END BASICS -->

          <br />
          <br />
          <h4>Alerts</h4>
          <p>
            Configure custom alerts to appear when a specific parameter
            threshold is met.
          </p>
          <hr />

          <div class="alertsContainer">
            {#each view.alerts as alert, i}
              <div class="alertContainer">
                <div class="input-group">
                  <div class="col-sm-6 col-12 pl-1 pr-1">
                    <label class="label" for="alertMessage">Message</label>
                    <input
                      required
                      value={alert.message}
                      class="value form-control"
                      type="text"
                      name="alert-message-{i}"
                    />
                  </div>

                  <div class="col-sm-3 col-12 pl-1 pr-1">
                    <label class="label" for="alertValue">Value</label>
                    <input
                      required
                      value={alert.value}
                      class="form-control"
                      type="number"
                      name="alert-value-{i}"
                    />
                  </div>

                  <div class="col-sm-3 col-12 pl-1 pr-1">
                    <label for="alert-op-{i}">Operand</label>
                    <select
                      required
                      value={alert.op}
                      name="alert-op-{i}"
                      class="form-control"
                    >
                      <option value="">-</option>
                      {#each ["=", ">", "<", ">=", "<="] as op}
                        <option value={op}>
                          {op}
                        </option>
                      {/each}
                    </select>
                  </div>

                  <div class="col-sm-6 col-12 pl-1 pr-1">
                    <label class="label" for="alert-pid-{i}">Parameter</label>

                    <select
                      use:pidChange
                      value={alert.pid}
                      name="alert-pid-{i}"
                      class="value form-control pl-1 pr-1"
                      id="alert-pid-{i}"
                      required
                    >
                      <option value="">-</option>
                      {#each pids as pid}
                        <option value={pid}>
                          {pid
                            ? KE_PID[pid].shortDesc
                              ? KE_PID[pid].shortDesc
                              : "Undefined"
                            : ""}
                        </option>
                      {/each}
                    </select>
                  </div>

                  <div class="col-sm-3 col-12 pl-1 pr-1">
                    <label class="label" for="alert-unit-{i}">Unit</label>
                    <select
                      name="alert-unit-{i}"
                      class="form-control value"
                      required><option>-</option></select
                    >
                  </div>

                  <div class="col-sm-3 col-12 pl-1 pr-1">
                    <label class="label" for="alert-priority-{i}"
                      >Priority <i>(Lower equals higher priority)</i></label
                    >
                    <input
                      required
                      value={alert.priority}
                      class="value form-control"
                      type="number"
                      name="alert-priority-{i}"
                    />
                  </div>
                </div>

                <div class="mt-2 text-center">
                  <button
                    on:click={() => {
                      removeAlert(i);
                    }}
                    class="form-control delete"
                    type="button">Delete</button
                  >
                </div>
              </div>
            {/each}

            <div class="col-sm-12 col-auto">
              <button class="form-control" on:click={() => addAlert()}
                >New alert</button
              >
            </div>
          </div>
          <!-- END ALERTS -->

          <br />
          <br />
          <h4>Dynamic</h4>
          <p>Configure when <i>this</i> view should be enabled.</p>
          <hr />

          <div class="dynamicContainer">
            <div class="row">
              <div class="col-sm-3 col-12">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    name="dynamic-enabled"
                    id="dynamic-enabled"
                  />
                  <label class="form-check-label" for="flexCheckIndeterminate">
                    Indeterminate checkbox
                  </label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-3 col-12">
                <label for="dynamicPID">Parameter</label>

                <select
                  use:pidChange
                  value={view.dynamic.pid}
                  disabled={!view.dynamic.enabled}
                  name="dynamic-pid"
                  class="form-control"
                  id="dynamicPID"
                  required
                >
                  <option value="">-</option>
                  {#each pids as pid}
                    <option value={pid}>
                      {KE_PID[pid].shortDesc
                        ? KE_PID[pid].shortDesc
                        : "Undefined"}
                    </option>
                  {/each}
                </select>
              </div>

              <div class="col-sm-3 col-12">
                <label class="label" for="dynamicUnit">Unit</label>
                <select
                  name="dynamic-unit"
                  disabled={!view.dynamic.enabled}
                  class="form-control value"
                  required><option>-</option></select
                >
              </div>

              <div class="col-sm-3 col-12">
                <label for="dynamicValue">Value</label>
                <input
                  required
                  value={view.dynamic.value}
                  disabled={!view.dynamic.enabled}
                  class="form-control"
                  type="number"
                  name="dynamic-value"
                />
              </div>

              <div class="col-sm-3 col-12">
                <label for="dynamicOP">Operand</label>
                <select
                  required
                  value={view.dynamic.op}
                  name="dynamic-op"
                  disabled={!view.dynamic.enabled}
                  class="form-control"
                >
                  <option value="">-</option>
                  {#each ["=", ">", "<", ">=", "<="] as op}
                    <option value={op}>
                      {op}
                    </option>
                  {/each}
                </select>
              </div>

              <div class="col-sm-3 col-12">
                <label for="dynamicPriority"
                  >Priority <i>(Lower equals higher priority)</i></label
                >
                <input
                  required
                  value={view.dynamic.priority}
                  disabled={!view.dynamic.enabled}
                  class="form-control"
                  type="number"
                  name="dynamic-priority"
                />
              </div>
            </div>
          </div>

          <hr class="mb-4" />
          <button
            class="btn btn-primary btn-lg btn-block btn-full-width"
            type="submit">Update</button
          >
          <br />
          <br />
        </form>
      </div>
    </div>
  {/if}
</form>

<style>
  .alertContainer {
    padding: 5px;
    margin: 5px;
    border-radius: 0.5em;
    border: grey;
    border-width: 1px;
    border-style: solid;
  }

  .delete {
    background-color: rgb(220, 176, 176);
  }

  .btn-full-width {
    width: 100%;
  }
</style>
