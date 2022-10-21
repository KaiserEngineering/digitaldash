<script lang="ts">
  import { keys } from "$lib/Keys";
  import { getContext } from "svelte";
  import { enhance } from "$app/forms";
  import { goto, invalidate, invalidateAll } from "$app/navigation";

  const { session } = getContext(keys.session);
</script>

<div class="col-sm-12 col-md-6 justify-content-center d-flex">
  <form
    method="POST"
    class="form-signin"
    use:enhance={() => {
      return async ({ result }) => {
        if (result.data.theme == "alert-success") {
          window.location.assign("/");
        }
        result.data.id = $session.count;
        $session.actions = [result.data];
      };
    }}
  >
    <div class="text-center container">
      <img src="images/logo.png" alt="" width="72" height="72" />
      <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
    </div>

    <div class="form-label-group">
      <input
        type="text"
        name="username"
        id="Username"
        class="mb-2 form-control"
        placeholder="username"
        required
      />
      <label for="username">Username</label>
    </div>

    <div class="form-label-group">
      <input
        type="password"
        name="password"
        id="password"
        class="mb-2 form-control"
        placeholder="Password"
        required
      />
      <label for="password">Password</label>
    </div>

    <button class="btn btn-lg btn-primary btn-block" type="submit"
      >Sign in</button
    >
  </form>
</div>
