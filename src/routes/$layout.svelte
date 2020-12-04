<script context="module">
  export async function preload(page, session) {
    const { user } = session;

    if (!user && page.path != '/login' ) {
      return this.redirect(302, 'login');
    }
  }
</script>

<script>
  import Nav from "../components/Nav.svelte";
  import Notifications from '../components/Notifications.svelte';

  export let segment;
  let actions = [];
</script>

{#if !segment || segment != 'login'}
  <Nav segment={segment}/>
{/if}

<Notifications actions={actions} />

<slot actions={actions}></slot>

<style>
</style>
