<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from '$app/navigation';

  import { onMount } from 'svelte';

  let content = $page.data.content;
  let temperature = $page.data.cpuTemp;
  let logNames: any[] = $page.data.logNames;
  let logs = $page.data.logs;
  let current = $page.data.current;

  function loadContent(logFile: string | number) {
    content = logs[logFile];
  }
</script>

<div class="container col-sm-10 col-md-6 pr-4 pl-4">

  <h1>Debug</h1>
  <p>Debug page, usefull to analyze unexpected issues</p>


  <h4>CPU Temperature</h4>
  <p>{temperature} °C</p>

  <h4>Logs Viewer</h4>
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

  <div class="container form-control col-sm-12 col-md-12 border">
    <pre>
      <code>
        {#if content}
          {content}
        {:else}
          No logs available.
        {/if}
      </code>
    </pre>
  </div>

  <p></p>

  <form
    method="POST"
    action="?/reboot"

    on:submit={() => {
        goto('/');
    }}
  >
    <h4>Reboot KE Dash</h4>
    <p><button type="submit" class="btn btn-primary btn-sm btn-block">Reboot</button></p>
  </form>
</div>
