<script context="module">
  export async function load({page, context, session, fetch}) {
    const { user } = session;

    if ( !user && page.path != '/login' ) {
      return { props: { segment: page.path }, redirect: { status: 301, to: `/login` } };
    }
    return { props: { segment: page.path } };
  }
</script>

<script>
  import Nav from "../components/Nav.svelte";
  import Notifications from '../components/Notifications.svelte';

  export let segment = undefined;
</script>

{#if !segment || segment != '/login'}
  <svelte:component this={Nav} segment={segment} />
{/if}

<div class="col-sm-12 col-md-6">
  <svelte:component this={Notifications} />
</div>

<slot></slot>
