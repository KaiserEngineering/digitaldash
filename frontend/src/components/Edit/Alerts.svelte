<script lang="ts">
  import type { View } from "src/app";
  import PID from "./Elements/PID.svelte";

  export let view: View;

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
</script>

<h4>Alerts</h4>

<p>
  Configure custom alerts to appear when a specific parameter threshold is met.
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

          <PID
            inputName="alert-pid-{i}"
            unitName="alert-unit-{i}"
            pid={view.alerts[i].pid}
            unit={view.alerts[i].unit}
          />
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

      <div class="mt-2 m-2 text-center">
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

  <div class="col-sm-12 m-2 col-auto">
    <button type="button" class="form-control" on:click={addAlert}
      >New alert</button
    >
  </div>
</div>
