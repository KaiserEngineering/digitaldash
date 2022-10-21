<script lang="ts">
  import { page } from "$app/stores";
  import type { PageData } from "./$types";
  import { keys } from "$lib/Keys";
  import { getContext } from "svelte";
  import { enhance } from "$app/forms";

  import Alerts from "$components/Edit/Alerts.svelte";
  import Basics from "$components/Edit/Basics.svelte";
  import Dynamic from "$components/Edit/Dynamic.svelte";

  export let data: PageData;

  const { session } = getContext(keys.session);
  const view = $session.configuration.views[data.id];
  const themes = $session.constants.themes || [];
</script>

<form
  method="POST"
  class="col-sm-12 col-sm-8 pb-4"
  use:enhance={() => {
    return async ({ result }) => {
      result.data.id = $session.count;
      $session.actions = [result.data];
    };
  }}
>
  <div id="edit-container" class="container">
    <div class="col-sm-12 order-sm-1">
      <h4 class="mb-3">Editing view #{data.id}</h4>
      <form method="POST" class="needs-validation">
        <input type="hidden" value={data.id} name="id" />

        <Basics {view} {themes} />

        <br />
        <br />

        <Alerts {view} />

        <br />
        <br />

        <Dynamic {view} />

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
