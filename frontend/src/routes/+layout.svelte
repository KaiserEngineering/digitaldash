<script lang="ts">
  import "../app.css";

  import Nav from "$components/Nav.svelte";
  import Notifications from "$components/Notifications.svelte";

  export let segment: string = "";
  export let title = "KE Digital Dash";
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

{#if !segment || segment != "/login"}
  <svelte:component this={Nav} {segment} />
{/if}

<div class="col-sm-12 col-md-6">
  <svelte:component this={Notifications} />
</div>

<slot />
