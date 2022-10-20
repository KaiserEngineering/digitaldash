<script lang="ts">
  import "../app.css";
  import { page } from "$app/stores";

  import { keys } from "$lib/Keys";
  import { getContext, setContext } from "svelte";
  import { writable } from "svelte/store";

  /* create scoped $session store */
  setContext(keys.session, { session: writable() });
  const { session } = getContext(keys.session);
  $session = $page.data.locals;

  import Nav from "$components/Nav.svelte";
  import Notifications from "$components/Notifications.svelte";

  export let title = "KE Digital Dash";
  let segment = $page.url.pathname;
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

{#if segment && segment != "/login"}
  <svelte:component this={Nav} />
{/if}

<div class="col-sm-12 col-md-6">
  <svelte:component this={Notifications} />
</div>

<slot />
