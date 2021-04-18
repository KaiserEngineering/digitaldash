<script>
  import { goto } from "$app/navigation";
  import { session } from "$app/stores";

  let username;
  let password;

  function handleSubmit() {
    fetch("/api/user", {
        method      : "POST",
        mode        : 'cors',
        credentials : 'same-origin',
        body: JSON.stringify({
          Username: username,
          Password: password
        }),
      })
      .then(d => d.json())
      .then(d => {
        if ( d.ret ) {
          $session.user = d.user;
          goto( '/' );
        }
        // Only add notification for failed login
        else {
          $session.actions = [{
            id    : $session.count,
            msg   : d.message,
            theme : 'alert-danger',
          }, ...$session.actions];
        }
      });
  }
</script>

<div class="col-sm-12 col-md-6 justify-content-center d-flex">
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
</div>