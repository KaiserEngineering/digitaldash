<script lang="ts">
  import { keys } from "$lib/Keys";
  import { getContext } from "svelte";
  import { enhance } from "$app/forms";

  const { session } = getContext(keys.session);

  let configString = JSON.stringify($session.configuration, null, 2);

  let invalid = false;
  $: {
    try {
      JSON.parse(configString);
      invalid = false;
    } catch (e) {
      invalid = true;
    }
  }
</script>

<form
  method="POST"
  class="col-12 advanced"
  action="?/updateConfig"
  use:enhance={() => {
    return async ({ result }) => {
      result.data.id = $session.count;
      $session.configuration = result.data.config;
      $session.actions = [result.data];
    };
  }}
>
  {#if invalid}
    <div class="alert alert-danger">Invalid JSON</div>
  {/if}

  <textarea name="config" class="form-control" bind:value={configString} />

  <button disabled={invalid} class="mt-2 form-control" type="submit"
    >Save</button
  >

  <button class="mt-2 form-control" type="submit" formaction="?/reset"
    >Reset To Default</button
  >
</form>

<style>
  textarea {
    width: 100%;
    height: 500px;
  }
</style>
