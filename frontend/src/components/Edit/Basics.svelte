<script lang="ts">
  import type { View } from "src/app";
  import PID from "./Elements/PID.svelte";

  export let view: View;
  export let themes: string[];

  let theme: string = view.gauges[0].theme;
</script>

<h4>Basics</h4>
<hr />

<div class="basicsContainer">
  <div class="col-12">
    <label for="name">View name</label>
    <input
      value={view.name}
      name="basics-name"
      type="text"
      class="form-control"
      id="name"
      required
    />
  </div>

  <div class="row">
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
  </div>

  <div class="col-12">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>Vehicle Parameters</label>
    <div class="row">
      {#each Array(3) as _, i}
        <div class="col-md-4">
          <PID
            inputName="gauge-pid-{i}"
            pid={view.gauges[i].pid}
            unit={view.gauges[i].unit}
          />
        </div>
      {/each}
    </div>
  </div>
</div>

<div class="col-12">
  <div class="form-check">
    <input
      id="dynamic-min-max"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      title="Show default min/max values or show dynamic values based on observed min max"
      class="form-check-input"
      type="checkbox"
      name="dynamic-min-max"
      checked={view.dynamicMinMax}
    />
    <label class="form-check-label" for="dynamic-min-max">
      Observed Min/Max
    </label>
  </div>
</div>
