<div class="m-4">
  <div class="w-50 text-center">
    <div class="alert" role="alert">
      {#each actions as action}
      <p>{action}</p>
      {/each}
    </div>
  </div>
</div>

<script>
  export let actions;
</script>
