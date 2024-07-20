<script lang="ts">
  import { onMount } from 'svelte';

  let navbarCollapse: HTMLDivElement;
  let navbarToggler: HTMLButtonElement;

  function handleLinkClick() {
    if (navbarCollapse.classList.contains('show')) {
      navbarToggler.click();
    }
  }

  onMount(() => {
    const links = navbarCollapse.querySelectorAll('a.nav-link');
    links.forEach(link => {
      link.addEventListener('click', handleLinkClick);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleLinkClick);
      });
    };
  });
</script>

<div class="m-4">
  <div class="nav-scroller py-1 mb-2">
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">KE</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          aria-expanded="false"
          aria-controls="navbarCollapse"
          data-bs-target="#navbarCollapse"
          aria-label="Toggle navigation"
          bind:this={navbarToggler}
        >
          <span class="navbar-toggler-icon" />
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse" bind:this={navbarCollapse}>
          <ul class="navbar-nav nav mr-auto mb-2 mb-md-0">
            <li class="nav-item">
              <a class="nav-link" href="/">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/splash">Splash Screen</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/settings">Settings</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/advanced">Advanced</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/debug">Debug</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</div>
