<Notifications {actions} />

<form on:submit|preventDefault="{handleSubmit}">
  <div class="row">
    <div class="col-md-12 order-md-1">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="username">Username</label>
            <input bind:value={username} type="text" class="form-control" name="username" required>
            <div class="invalid-feedback">
              Username is required
            </div>
          </div>

          <div class="col-md-6 mb-3">
            <label for="password">Password</label>
            <input bind:value={password} type="password" class="form-control" name="password" required>
            <div class="invalid-feedback">
              Password is required
            </div>
          </div>
        </div>

      <button class="btn btn-lg btn-primary btn-block" type="submit">Update settings</button>
    </div>
  </div>
</form>

<script>
  import Notifications from '../components/Notifications.svelte';
  let actions = [];
  let username;
  let password;

  function handleSubmit(event) {
    fetch("./api/settings", {
        method      : "POST",
        body: JSON.stringify({
          username: username,
          password: password
        })
      })
      .then(d => d.json())
      .then(d => (actions = [d.message] ));
  }
</script>
