<!-- Handle units updating based on a PID change -->
<script lang="ts">
  import { keys } from "$lib/Keys";
  import { getContext } from "svelte";

  const { session } = getContext(keys.session);

  const UNIT_LABEL = $session.constants.PID_UNIT_LABEL;
  const KE_PID = $session.constants.KE_PID;
  const pids = Object.keys(KE_PID).sort((a, b) => KE_PID[a].shortDesc > KE_PID[b].shortDesc);

  export let inputName: string;
  export let unitName: string;
  export let pid: string;
  export let unit: string;
  export let enabled: boolean = true;

  function updateUnitOptions() {
    if (!pid) {
      return;
    }
    const pidStringValue = "" + pid;
    unitOptions = KE_PID[pidStringValue].units;

    unit = Object.keys(unitOptions)[0];
  }

  const pidStringValue = "" + pid;
  let unitOptions: {} = {};
  if (pid) {
    unitOptions = KE_PID[pidStringValue].units;
  }
</script>

<div class="col-12">
  <select
    disabled={!enabled}
    name={inputName}
    bind:value={pid}
    class="m-1 form-control"
    on:change={updateUnitOptions}
  >
    <option value="">-</option>
    {#each pids as pid}
      <option value={pid}>
        {KE_PID[pid].shortDesc ? KE_PID[pid].shortDesc : "Undefined"}
      </option>
    {/each}
  </select>
</div>

<div class="col-12">
  <select
    disabled={!enabled}
    name={unitName}
    value={unit}
    class="form-control m-1"
  >
    {#each Object.keys(unitOptions) as unitKey}
      <option value={unitKey}>
        {UNIT_LABEL[unitKey]}
      </option>
    {/each}
  </select>
</div>
