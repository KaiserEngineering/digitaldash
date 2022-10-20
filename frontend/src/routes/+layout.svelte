<script lang="ts">
  import "../app.css";
  import { page } from "$app/stores";

  import { keys } from "$lib/keys";
  import { getContext, setContext } from "svelte";
  import { writable } from "svelte/store";

  /* create scoped $session store */
  setContext(keys.session, { session: writable() });
  const { session } = getContext(keys.session);
  $session = $page.data.locals.session;

  import Nav from "$components/Nav.svelte";
  import Notifications from "$components/Notifications.svelte";

  export let segment: string = "";
  export let title = "KE Digital Dash";
</script>

/* src/routes/+layout.svelte */
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
