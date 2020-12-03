<script>
  import { authenticated } from "./stores";
  import { goto } from "$app/navigation";
  import Nav from "../components/Nav.svelte";

  export let segment;

  // if ( segment != 'login' && !$authenticated ) {
  //   goto( '/login' );
  // }
</script>

{#if segment != 'login'}
  <Nav segment={segment}/>
{/if}
<slot></slot>

<style>
  
</style>
