<script context="module">
  export async function preload(page, session) {
    return { session }
  }
</script>

<script>
  import { goto } from "$app/navigation";

  export let session;
  export let actions = [];

  export let actions = [];

  let username;
  let password;

  function handleSubmit(event) {
    fetch("/api/authenticate", {
        method      : "POST",
        mode        : 'cors',
        credentials : 'same-origin',
        body: JSON.stringify({
          username: username,
          password: password
        })
      })
      .then(d => d.json())
      .then(d => {
        if ( d.ret ) {
          goto( '/' );
        }
        actions = [d.message];
      });
  }
</script>

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
