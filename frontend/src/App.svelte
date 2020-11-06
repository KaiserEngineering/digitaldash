<script>
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./pages/Home.svelte";
  import Settings from "./pages/Settings.svelte";
  import Edit from "./pages/Edit.svelte";
  import NAV from './components/Nav.svelte';

  export let url = "";
</script>

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