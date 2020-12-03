<script>
  import { authenticated } from './stores';
  import { goto } from "$app/navigation";

  export let segment;

  // if ( segment != 'login' && !$authenticated ) {
  //   goto( '/login' );
  // }
</script>

<slot></slot>

<style>
</style>
