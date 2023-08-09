<script lang="ts">
  import type { PageData } from "./$types";
  import { keys } from "$lib/Keys";
  import { getContext } from "svelte";
  import { enhance } from "$app/forms";

  import Alerts from "$components/Edit/Alerts.svelte";
  import Basics from "$components/Edit/Basics.svelte";
  import Dynamic from "$components/Edit/Dynamic.svelte";
  import { goto } from "$app/navigation";

  export let data: PageData;

  const { session } = getContext(keys.session);
  const view = $session.configuration.views[data.id];
  const themes = $session.constants.themes || [];

  function handleFormSubmissionResults(result: any) {
        if (result?.data?.config) {
            $session.configuration = result.data.config;
        }

        // result.data.id = $session.count;
        $session.actions = [result.data];
        goto("/");
    }
</script>

<form
  action="?/update"
  method="POST"
  class="col-sm-12 col-sm-8 pb-4 needs-validation"
  use:enhance={() => {
    return async ({ result }) => {
      if (result.data.config) {
        $session.configuration = result.data.config;
      }

      result.data.id = $session.count;
      $session.actions = [result.data];
    };
  }}
>
  <div id="edit-container" class="container">
    <div class="col-sm-12 order-sm-1">
      <h4 class="mb-3">Editing view #{data.id}</h4>
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

      <form
          class="m-2"
          method="POST"
          action="?/removeView"
          use:enhance={() => {
          return async ({ result }) => {
              handleFormSubmissionResults(result);
          };
          }}
      >
        <div class="row justify-content-center">
            <input
                name="config"
                value={JSON.stringify($session.configuration)}
                type="hidden"
            />
            <input name="id" value={data.id} type="hidden" />

            <button type="submit" class="fs-6 btn text-white" style="background-color: #ff4d4d">Delete View</button>
          </div>
      </form>
    </div>
  </div>
</form>

<style>
  .btn-full-width {
    width: 100%;
  }
</style>
