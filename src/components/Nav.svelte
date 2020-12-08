<script>
  export let segment;
</script>

<div class="m-4">
  <div class="nav-scroller py-1 mb-2">
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">KE</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav nav mr-auto mb-2 mb-md-0">
            <li class="nav-item">
              <a class:active="{!segment}" class="nav-link" href="/">Home</a>
            </li>
            <li class="nav-item">
              <a class:active="{segment === 'settings'}" class="nav-link" href="settings">Settings</a>
            </li>
            <li class="nav-item">
              <a class:active="{segment === 'advanced'}" class="nav-link" href="advanced">Advanced</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</div>
