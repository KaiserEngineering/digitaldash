<script lang="ts">
  import { keys } from "$lib/Keys";
  import { getContext } from "svelte";
  import { enhance } from "$app/forms";

  const { session } = getContext(keys.session);
</script>

<div class="container col-sm-10 col-md-6 pr-4 pl-4">
<form
  method="POST"
  use:enhance={() => {
    return async ({ result }) => {
      result.data.id = $session.count;
      $session.actions = [result.data];
    };
  }}
>
    <h1>Settings</h1>
    <p>Change your username and password credentials</p>
    <div class="row">
      <div class="col-md-6 mb-3">
        <label for="username">Username</label>
        <input type="text" class="form-control" name="username" required />
        <div class="invalid-feedback">Username is required</div>
      </div>

      <div class="col-md-6 mb-3">
        <label for="password">Password</label>
        <input type="password" class="form-control" name="password" required />
        <div class="invalid-feedback">Password is required</div>
      </div>
    </div>

    <button class="mt-2 form-control btn btn-primary btn-lg btn-block btn-full-width" type="submit"
      >Update settings</button
    >
  </form>
</div>