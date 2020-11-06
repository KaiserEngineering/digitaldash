<Notifications {actions} />

{#await promise}
  <p>...waiting</p>
  {:then}
  <div id="edit-container" class="container">
    <div class="col-md-12 order-md-1">
      <h4 class="mb-3">Editing view #{id}</h4>
      <form on:submit|preventDefault="{handleSubmit}" class="needs-validation">
        <input type="hidden" value="<%$id%>" name="id"/>

        <div class="col-12">
          <h4>Basics</h4>
          <hr/>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="name">View name</label>
            <input bind:value={view.name} name="name" type="text" class="form-control" id="name" placeholder="" required>
            <div class="invalid-feedback">
              View name is required
            </div>
          </div>
        </div>

        <div class="mb-3 row">
          <div class="col-6">
            <label for="background">Background</label>
            <div class="input-group">
              <select bind:value={view.background} name="background" class="custom-select form-control d-block w-100" id="country" required>
                <option value="">-</option>
              </select>
              <div class="invalid-feedback" style="width: 100%;">
                Background is required
              </div>
            </div>
          </div>
          <div class="col-6">
            <label for="theme">Theme</label>
            <div class="input-group">
              <select bind:value={view.theme} name="theme" class="form-control custom-select d-block w-100" id="theme" required>
                <option value="">-</option>
              </select>
              <div class="invalid-feedback" style="width: 100%;">
                Theme is required
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          Vehicle Parameters
        </div>

  <!-- PID were here -->

        <div class="mt-3 col-12">
          <h4>Alerts</h4>
          <hr/>
        </div>

        <hr class="mb-4">
        <button class="btn btn-primary btn-lg btn-block" type="submit">Update</button>
      </form>
    </div>
  </div>
{/await}

<script>
  import Notifications from '../components/Notifications.svelte';

  export let id;
  let actions = [];
  let view    = {};

  async function getConfigs() {
    const res = await fetch("./api/config", {
        method : "get",
      });
      const data = await res.json();

      if (res.ok) {
        view = data.views[id];
        return data.views[id];
      } else {
        throw new Error(data);
      }
    }
    let promise = getConfigs();

  function handleSubmit(event) {
    fetch("./api/update", {
        method      : "POST",
        mode        : 'cors',
        credentials : 'same-origin',
        body: JSON.stringify(view)
      })
      .then(d => d.json())
      .then(d => {
        actions = [d.message];
        view    = d.view
      });
  }
</script>
