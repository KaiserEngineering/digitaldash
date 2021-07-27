<script context="module">
  export async function load({ fetch }) {
    const res = await fetch("/api/overlays");

    if (res.ok) {
      let data = await res.text();

      return {
        props: {
          content: data,
        },
      };
    }

    return {
      status: res.status,
      error: new Error(`Could not load /api/overlays`),
    };
  }
</script>

<script>
  import hljs from "highlight.js/lib/core";
  import python from "highlight.js/lib/languages/python";
  hljs.registerLanguage("python", python);

  export let content = "Loading...";

  var html = hljs.highlight(content, { language: "python" }).value;
</script>

<textarea class="form-control" bind:value={html} />

<style>
  textarea {
    width: 100%;
  }
</style>
