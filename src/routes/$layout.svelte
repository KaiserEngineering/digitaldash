<script context="module">
  export async function load({page, session}) {
    const { user } = session;
    // console.log("Why is seesion empty?: ",session);

    if ( !user && page.path != '/login' ) {
      return {
        redirect: '/login',
        status  : 301
      };
    }
    return { props: { segment: page.path } };
  }
</script>

<script>
  import Nav from "$lib/Nav.svelte";
  import Notifications from '$lib/Notifications.svelte';

  export let segment = undefined;
  export let title   = "KE!"
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

{#if !segment || segment != '/login'}
  <svelte:component this={Nav} segment={segment} />
{/if}

<div class="col-sm-12 col-md-6">
  <svelte:component this={Notifications} />
</div>

<slot />
{''}
