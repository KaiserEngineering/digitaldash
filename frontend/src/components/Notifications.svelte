{#if actions.length}
  <div class="notifications alert alert-info" role="alert">
    {#each actions as action}
    {action}
    {/each}
  </div>
{/if}

<script>
  export let actions;
</script>

<style>
  .notifications {
    width: 80%;
    text-align: center;
    margin-left: auto;
    margin-right: auto
  }
</style>
