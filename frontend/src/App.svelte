{#if $authenticated}
<Router url="{url}">
  <NAV>
    <nav>
      <Link to="/">Home</Link>
      <Link to="settings">Settings</Link>
    </nav>
  </NAV>

  <div>
    <Route path="edit/:id" component="{Edit}" />
    <Route path="settings" component="{Settings}" />
    <Route path="/"><Home /></Route>
  </div>
</Router>
{:else}
  <Login />
{/if}

<script>
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./pages/Home.svelte";
  import Settings from "./pages/Settings.svelte";
  import Edit from "./pages/Edit.svelte";
  import Login from "./pages/Login.svelte";
  import NAV from './components/Nav.svelte';
  import { authenticated } from './stores.js';

  export let url = "";
</script>
