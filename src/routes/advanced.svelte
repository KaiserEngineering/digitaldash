<script context="module">
  export async function preload(page, session) {
    const response      = await this.fetch( '/api/config' );
    const configuration = await response.json();

    return { configuration: configuration };
  }
</script>

<script>
  export let configuration;

  function submit() {
    fetch("/api/config", {
        method : "POST",
        body   : JSON.stringify( configuration )
      })
      .then(d => d.json())
      .then(d => {
        $session.actions = [ d.message, ...$session.actions ];
      });
  }
</script>

<div class="advanced">
  <textarea>
    {configuration}
  </textarea>
  <button type="submit" on:click="{submit}">Save</button>
</div>


<style>
  textarea {

  }
</style>
