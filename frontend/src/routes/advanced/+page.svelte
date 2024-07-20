<script lang="ts">
  import { keys } from "$lib/Keys";
  import { getContext } from "svelte";
  import { enhance } from "$app/forms";
  import { goto } from '$app/navigation';
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

<div class="container col-sm-10 col-md-6 pr-4 pl-4">
  <form
    method="POST"
    class="col-12 advanced"
    action="?/updateConfig"
    use:enhance={() => {
      return async ({ result }) => {
        result.data.id = $session.count;
        $session.configuration = result.data.config;
        $session.actions = [result.data];

        goto('/');
      };
    }}
  >

  <h1>Advanced</h1>
  <p>Settings for advanced users, beware of what you change!</p>

  {#if invalid}
    <div class="alert alert-danger">Invalid JSON</div>
  {/if}

  <textarea name="config" class="form-control" bind:value={configString} />

  <button disabled={invalid} class="mt-2 form-control btn btn-primary btn-lg btn-block btn-full-width" type="submit"
    >Save</button
  >

  <button class="mt-2 form-control btn btn-primary btn-block btn-full-width" style="background-color: #ff4d4d" type="submit" formaction="?/reset"
    >Reset To Default</button
  >
</form>
</div>

<style>
  textarea {
    width: 100%;
    height: 500px;
  }
</style>
