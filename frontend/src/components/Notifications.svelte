<script lang="ts">
  import { keys } from "$lib/Keys";
  import { getContext } from "svelte";

  const { session } = getContext(keys.session);

  $: {
    if ($session.actions && $session.actions.length) {
      $session.count = $session.count + 1;
    }
    $session.actions.forEach((item: { id: any }) => {
      setTimeout(() => remove(item.id), 3000);
    });
  }

  function remove(id: any) {
    $session.actions = $session.actions.filter((action: { id: any }) => {
      action.id != id;
    });
  }
</script>

{#if $session.actions && $session.actions.length}
  <div class="notifications" id="notifications">
    {#each $session.actions as action (action.id)}
      <div
        class="alert-dismissible fade show alert {action.theme}"
        role="alert"
      >
        {action.msg}

        <button
          on:click={() => remove(action.id)}
          type="button"
          class="btn-close"
          aria-label="Close"
        />
      </div>
    {/each}
  </div>
{/if}

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
