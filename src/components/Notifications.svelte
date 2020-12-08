{#if $session.actions && $session.actions.length}
  {#each $session.actions as action, i}
    <div class="text-center float-center notification alert alert-info" role="alert">
      {action}
      <button type="button" on:click="{() => remove(i)}" class="float-right close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  {/each}
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
  .notification {
    width: 80%;
    left: 10%;
  }
</style>
