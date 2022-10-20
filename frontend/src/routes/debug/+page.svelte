<script lang="ts">
  import { page } from "$app/stores";
  import { redirect } from "@sveltejs/kit";

  let content = $page.data.content;
  let logNames: any[] = $page.data.logNames;
  let logs = $page.data.logs;
  let current = $page.data.current;

  function loadContent(logFile: string | number) {
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

  <div class="container col-sm-12 col-md-6 border">
    <pre>
      <code>
        {content}
      </code>
    </pre>
  </div>
</div>
