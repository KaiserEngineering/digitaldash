<script context="module">
  export async function load({ fetch }) {
    const res = await fetch( "/api/debug" );

    if (res.ok) {
      return {
        props: {
          content: await res.text()
        }
      };
    }

    return {
      status: res.status,
      error: new Error(`Could not load /api/debug`)
    };
  }
</script>

<script>
  export let content = "Loading...";

  function refresh() {
    fetch("/api/debug")
      .then(d => d.text())
      .then(d => {
        content = d;
    });
  }
</script>

<button type="button" class="btn btn-secondary" on:click="{refresh}">Refresh</button>

<div class="container col-sm-12 col-md-6 border">
  <pre>
    <code>
      {content}
    </code>
  </pre>
</div>
