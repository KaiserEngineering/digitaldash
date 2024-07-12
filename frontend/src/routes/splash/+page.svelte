<script lang="ts">
  import { keys } from "$lib/Keys";
  import { getContext } from "svelte";
  import { enhance } from "$app/forms";
  
  const { session } = getContext(keys.session);
  const directoryPath = 'images/Splash';
  
  export let data: { imageFiles: string[] };
  let selectedImage = data.imageFiles[0];
  let currentSplash = $session.configuration.splash;
</script>

<div class="container col-sm-10 col-md-6 pr-4 pl-4">
  <form method="POST"
        action="?/setSplash"
        use:enhance={() => {
          return async ({ result }) => {
            if (result.data.config) {
              $session.configuration = result.data.config;
            }
        
            result.data.splash = $session.count;
            $session.actions = [result.data];
          };
        }}
	  >
      <h1>Splash Screen</h1>
      <p>Select an image to set it as a boot screen</p>
  	
      <select class="custom-select form-control d-block w-100" bind:value={currentSplash}>
        {#each data.imageFiles as file}
          <option value={file}>{file.replace(/\.png|\.jpg/, "")}</option>
        {/each}
      </select>

      <div class="card transparent">
        <input type="hidden" name="selectedImage" value={currentSplash} />
        <img class="splash-preview" src={`${directoryPath}/${currentSplash}`} alt="Splash Screen" />
        <button class="mt-2 btn btn-primary btn-lg btn-block btn-full-width" type="submit">Update</button>
      </div>
  </form>
</div>
<style>
  img {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .splash-preview {
    width: 350px;
    height: 53px;
    object-fit: cover;
    object-position: top;
  }
  .card {
    border-radius: 20px;
    margin-top: 1em;
  }
  .transparent {
    border: transparent;
    background-color: transparent;
  }
</style>