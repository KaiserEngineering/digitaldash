<script context="module">
  export async function load({ url, session }) {
    const { user } = session;

    if (!user && url.pathname != "/login") {
      return {
        redirect: "/login",
        status: 301,
      };
    }
    return { props: { segment: url.pathname } };
  }
</script>

<script>
  import "../app.css";
  import Nav from "$components/Nav.svelte";
  // import Notifications from "$components/Notifications.svelte";

  export let segment = undefined;
  export let title = "KE Digital Dash";
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

{#if !segment || segment != "/login"}
  <svelte:component this={Nav} {segment} />
{/if}

<!-- <div class="col-sm-12 col-md-6">
  <svelte:component this={Notifications} />
</div> -->

<slot />
