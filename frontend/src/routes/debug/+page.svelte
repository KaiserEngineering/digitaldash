<script lang="ts">
  export let content = "Loading...";
  export let logNames: any[] = [];
  export let logs = {};
  export let current = "";

  function refresh() {
    fetch("/api/debug")
      .then((d) => d.json())
      .then((d) => {
        (content = d[Object.keys(d).sort().pop()]),
          (logNames = Object.keys(d)),
          (logs = d);
      });
  }

  function loadContent(logFile) {
    content = logs[logFile];
  }
</script>

<div class="col-11">
  <label for="logName">Log:</label>
  <select
    id="logName"
    bind:value={current}
    on:blur={(e) => loadContent(e.target.value)}
    class="custom-select form-control d-block w-100 mb-2"
    required
  >
    {#each logNames as log}
      <option value={log}>{log}</option>
    {/each}
  </select>

  <button type="button" class="mb-2 btn btn-secondary" on:click={refresh}
    >Refresh</button
  >

  <div class="container col-sm-12 col-md-6 border">
    <pre>
      <code>
        {content}
      </code>
    </pre>
  </div>
</div>
