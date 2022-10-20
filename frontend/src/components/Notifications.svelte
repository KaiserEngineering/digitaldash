<script>
  import { page } from "$app/stores";

  $: {
    if ($page.data.locals.actions && $page.data.locals.actions.length) {
      $page.data.locals.count = $page.data.locals.count + 1;
    }
    $page.data.locals.actions.forEach((item, index) => {
      setTimeout(() => remove(item.id), 3000);
    });
  }

  function remove(id) {
    $page.data.locals.actions = $page.data.locals.actions.filter(
      (action) => action.id != id
    );
  }
</script>

{#if $page.data.locals.actions && $page.data.locals.actions.length}
  <div class="notifications" id="notifications">
    {#each $page.data.locals.actions as action (action.id)}
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
