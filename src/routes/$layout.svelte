<script context="module">
  export async function preload(page, session) {
    const { user } = session;

    if ( !user && page.path != '/login' ) {
      return this.redirect( 302, `http://${page.host}/login` );
    }
  }
</script>

<script>
  import Nav from "../components/Nav.svelte";
  import Notifications from '../components/Notifications.svelte';

  export let segment;
</script>

{#if !segment || segment != 'login'}
  <svelte:component this={Nav} segment={segment} />
{/if}

<div class="col-sm-12 col-md-6">
  <svelte:component this={Notifications} />
</div>

<slot></slot>
