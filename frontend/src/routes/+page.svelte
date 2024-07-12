<script lang="ts">
  import { keys } from "$lib/Keys";
  import { getContext } from "svelte";
  import ViewPreview from "../components/ViewPreview.svelte";
  import { enhance } from "$app/forms";
  const { session } = getContext(keys.session);

  $: views = $session.configuration.views;
</script>

{#if views}
  <div class="container col-sm-10 col-md-6 pr-4 pl-4">
    <h1>KE Digital Dash</h1>
    <p>Select a gauge layout to edit the configuration</p>
  </div>
  {#each Object.keys(views) as id}
    <svelte:component this={ViewPreview} {id} view={views[id]} />
  {/each}
{/if}


<form
  method="POST"
  action="?/addView"
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
  <input
      name="config"
      value={JSON.stringify($session.configuration)}
      type="hidden"
  />

  <button type="submit" class="mt-2 btn btn-primary btn-lg btn-block">Add view</button>
</form>
