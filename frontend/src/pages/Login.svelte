<Notifications {actions} />

<form on:submit|preventDefault="{handleSubmit}" class="form-signin">
  <div class="text-center container">
    <img src="images/logo.png" alt="" width="72" height="72">
    <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
  </div>

  <div class="form-label-group">
    <input bind:value={username} type="text" name="username" id="Username" class="mb-2 form-control" placeholder="username" required>
    <label for="username">Username</label>
  </div>

  <div class="form-label-group">
    <input bind:value={password} type="password" name="password" id="password" class="mb-2 form-control" placeholder="Password" required>
    <label for="password">Password</label>
  </div>

  <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
</form>

<script>
  import Notifications from '../components/Notifications.svelte';
  let actions = [];
  let username;
  let password;

  function handleSubmit(event) {
    console.log(username)
    fetch("./api/authenticate", {
        method      : "POST",
        mode        : 'cors',
        credentials : 'same-origin',
        body: JSON.stringify({
          username: username,
          password: password
        })
      })
      .then(d => d.json())
      .then(d => (actions = [d.message] ));
  }
</script>
