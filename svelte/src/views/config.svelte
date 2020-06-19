<script>
    import Preview from '../components/Preview.svelte';
    import SortableList from 'svelte-sortable-list';
    import { config, getConfig, UpdateConfig, DeleteView } from '../store.js';
    import { getNotificationsContext } from 'svelte-notifications';
    import MdAdd from 'svelte-icons/md/MdAdd.svelte'
    import MdRemove from 'svelte-icons/md/MdRemove.svelte'

    const { addNotification } = getNotificationsContext();

    let promise = getConfig();

    function AddView() {
        let new_config = $config;
        new_config = {
          "name"       : "First view",
          "enabled"    : 0,
          "default"    : 1,
          "background" : "bg.jpg",
          "theme"      : "Stock",
          "pids"       : [],
          "alerts"     : [],
          "dynamic"    : {},
          "gauges"     : [],
          "id"         : Object.keys( new_config ).length
        };
        const message_promise = UpdateConfig(new_config, config);
        message_promise.then((res) => {
            addNotification({
                text: res,
                position: 'top-center',
            });
        });
    }

    function Delete( id ) {
      const message_promise = DeleteView( id );
        message_promise.then((res) => {
            addNotification({
                text: res,
                position: 'top-center',
            });
        });
    }
</script>

<div class="w-full">
    <div class="container mx-auto px-6 -mt-20">
        <div class="lg:max-w-md flex-1 bg-white rounded-lg shadow p-6">
            <h1 class="font-semibold text-md">
                Configure the Digital Dash background, gauge styles,
                parameters, alerts and dynamic triggers.
            </h1>
            <h4 class="inline-block py-2">
                The first enabled view is the default view.
            </h4>
        </div>
    </div>
</div>

<style>
  .icon {
    width: 32px;
    height: 32px;
  }
</style>

<button on:click="{AddView}" class="hover:bg-grey-light">
    <div class="fixed right-0 mx-2 bottom-0 my-10">
        <div class="icon bg-white rounded-full h-16 w-16 flex items-center justify-center">
          <MdAdd />
        </div>
    </div>
</button>

<div class="sm:w-full md:w-1/2 mx-auto flex-1 justify-center items-center">
    {#await promise}
        <span>...Loading</span>
    {:then}
        {#each Object.keys( $config ) as key }
            <div class="m-4">
                <button on:click={() => { Delete(key) }} class="icon mt-3 cursor-pointer">
                  <MdRemove />
                </button>
                <Preview view={$config[key]} id={key} />
            </div>
        {/each}
    {/await}
</div>

