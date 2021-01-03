{#if $session.actions && $session.actions.length}
  <div class="notifications" id="notifications">
    {#each $session.actions as action(action.id)}
      <div
        class="text-center notification alert {action.theme}"
        role="alert"
        out:fade
        animate:flip={{ duration: 200 }}
      >
        {action.msg}

        <button type="button" on:click="{() => remove(action.id)}" class="float-right close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    {/each}
  </div>
{/if}

<script>
  import { session } from "$app/stores";
  import { flip } from 'svelte/animate';
  import { fade, fly } from 'svelte/transition';

  $: {
    $session.count = $session.count + 1;
  }

  function remove( id ) {
    $session.actions = $session.actions.filter(action => action.id != id);
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
