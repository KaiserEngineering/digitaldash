<script lang="ts">
  import { keys } from "$lib/Keys";
  import { getContext } from "svelte";
  import { enhance } from "$app/forms";

  const { session } = getContext(keys.session);
</script>

<form
  method="POST"
  use:enhance={() => {
    return async ({ result }) => {
      result.data.id = $session.count;
      $session.actions = [result.data];
    };
  }}
>
  <div class="p-4 col-md-12 order-md-1">
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

    <button class="btn btn-lg btn-primary btn-block" type="submit"
      >Update settings</button
    >
  </div>
</form>
