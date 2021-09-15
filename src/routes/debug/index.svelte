<script context="module">
  export async function load({ fetch }) {
    const res = await fetch("/api/debug");

    if (res.ok) {
      let data = await res.json();
      const fileNames = Object.keys(data).sort();

      return {
        props: {
          // We don't want to mutate our array, so no pop()
          content: data[fileNames[fileNames.length - 1]],
          logNames: fileNames,
          logs: data,
          current: fileNames[fileNames.length - 1],
        },
      };
    }

    return {
      status: res.status,
      error: new Error(`Could not load /api/debug`),
    };
  }
</script>

<script>
  export let content = "Loading...";
  export let logNames = [];
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
