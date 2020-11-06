{#await promise}
  <p>...waiting</p>
  {:then data}
    {#each Object.keys(data.config) as id }
    
      <div class="container col-sm-10 col-md-6 pr-4 pl-4">
          <a href="#edit?id=<%$id%>">
            <h5>{data.config[id].name}</h5>
            <div class="card img-fluid">
              <img class="card-img-top" src="images/{data.config[id].background}" alt="view background">

              <div class="card-img-overlay">
                <img src="image/{data.config[id].theme}.png" class="card-img-top" alt="...">
              </div>
            </div>
            <div class="card-body text0-center">
              <label class="switch">
                <input onchange="ToggleEnabled({id});" type="checkbox" :enabled={data.config[id].enabled}>
                <span class="slider round"></span>
              </label>
          </a>
        </div>
    {/each}
  {:catch error}
    <p style="color: red">{error.message}</p>  
{/await}

<script>
  let info;
  async function getConfigs() {
    const res = await fetch("./api/config", {
        method : "get",
      });
      const data = await res.json();

      if (res.ok) {
        console.log(data)
        info = data
        return data;
      } else {
        throw new Error(data);
      }
    }
    let promise = getConfigs();


  function ToggleEnabled(id) {
    console.log('toggled')
  }
</script>
