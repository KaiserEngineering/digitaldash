<script lang="ts">
  import type { ActionData } from "./$types";
  import { keys } from "$lib/Keys";
  import { getContext } from "svelte";

  const { session } = getContext(keys.session);

  export let form: ActionData;

  if (form) {
    form.id = $session.count;
    $session.actions.push(form);
  }
</script>

<form method="POST">
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
