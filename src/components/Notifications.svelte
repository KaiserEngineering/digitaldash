{#if $session.actions && $session.actions.length}
  <div class="notifications alert alert-info" role="alert">
    {#each $session.actions as action, i}
      {action}
      <button type="button" on:click="{() => remove(i)}" class="close">
        <span aria-hidden="true">&times;</span>
      </button>
    {/each}
  </div>
{/if}

<script>
  import { session } from "$app/stores";

  function remove( index ) {
    let temp = $session.actions || [];
    temp.splice( index, 1 );

    $session.actions = temp;
  }
</script>

<style>
  .notifications {
    width: 80%;
    text-align: center;
    margin-left: auto;
    margin-right: auto
  }
</style>
