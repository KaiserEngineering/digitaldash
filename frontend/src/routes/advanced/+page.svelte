<script>
  import { keys } from "$lib/keys";
  import { getContext } from "svelte";

  const { session } = getContext(keys.session);

  let configString = JSON.stringify($session.configuration, null, 2);

  function submit() {
    fetch("/api/config", {
      method: "POST",
      body: configString,
    })
      .then((d) => d.json())
      .then((d) => {
        $session.configuration = d.config;
        configString = JSON.stringify(d.config, null, 2);

        $session.locals.actions = [
          {
            id: $session.count,
            msg: d.message,
            theme: d.ret ? "alert-info" : "alert-danger",
          },
          ...$session.locals.actions,
        ];
      });
  }

  let invalid = false;
  $: {
    try {
      JSON.parse(configString);
      invalid = false;
    } catch (e) {
      invalid = true;
    }
  }

  function reset() {
    fetch("/api/config", {
      method: "DELETE",
    })
      .then((d) => d.json())
      .then((d) => {
        $session.configuration = d.config;
        configString = JSON.stringify(d.config, null, 2);

        $session.locals.actions = [
          {
            id: $session.count,
            msg: d.message,
            theme: d.ret ? "alert-info" : "alert-danger",
          },
          ...$session.locals.actions,
        ];
      });
  }
</script>

<div class="col-12 pr-4 pl-4 advanced">
  {#if invalid}
    <div class="alert alert-danger">Invalid JSON</div>
  {/if}

  <textarea class="form-control" bind:value={configString} />
  <button
    disabled={invalid}
    class="mt-2 form-control"
    type="submit"
    on:click={submit}>Save</button
  >

  <button class="mt-2 form-control" type="submit" on:click={reset}
    >Reset To Default</button
  >
</div>

<style>
  textarea {
    width: 100%;
    height: 500px;
  }
</style>
