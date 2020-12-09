<div class="notifications" id="notifications">
  {#if $session.actions && $session.actions.length}
    {#each $session.actions as action, i}
      <div
        class="text-center notification alert alert-info"
        role="alert"
      >
        {action}
        <button type="button" on:click="{() => remove(i)}" class="float-right close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    {/each}
{/if}
</div>

<script>
  import { session } from "$app/stores";

  $: {
    if ( $session.actions.length > 3 ) {
      $session.actions.shift();
    }
  }

  function remove( index ) {
    if ( index !== 'undefined' ) {
      let temp = $session.actions || [];
      temp.splice( index, 1 );

      $session.actions = temp;
    }
    else {
      $session.actions = $session.actions.shift();
    }
  }
</script>

<style>
  .notifications {
    width: 50%;
    left: 25%;
    right: 25%;
    z-index: 2;
    position: fixed;
  }

  .notification {
    position: relative;
  }
</style>
