<script>
  import { session } from "$app/stores";

  let configString = JSON.stringify( $session.configuration, null, 2 );

  function submit() {
    fetch("/api/config", {
        method : "POST",
        body   : configString
      })
      .then(d => d.json())
      .then(d => {
        $session.configuration = d.config;
        $session.actions = [{
          id    : $session.count,
          msg   : d.message,
          theme : d.ret ? 'alert-info' : 'alert-danger',
        }, ...$session.actions];
      });
  }

  let invalid = false;
  $: {
    try {
        JSON.parse( configString );
        invalid = false;
    }
    catch ( e ) {
        invalid = true;
    }
  }
</script>

<div class="col-12 pr-4 pl-4 advanced">

  {#if invalid}
    <div class="alert alert-danger">
      Invalid JSON
    </div>
  {/if}

  <textarea class="form-control" bind:value="{configString}"></textarea>
  <button disabled={invalid} class="mt-2 form-control" type="submit" on:click="{submit}">Save</button>
</div>

<style>
  textarea {
    width: 100%;
    height: 500px;
  }
</style>
