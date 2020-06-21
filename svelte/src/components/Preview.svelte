<script>
    export let view;
    export let id;
    import { Link } from "svelte-routing";
    import { constants, config, UpdateEnable, DeleteView } from '../store.js';
    import { getNotificationsContext } from 'svelte-notifications';
    const { addNotification } = getNotificationsContext();
    import MdRemove from 'svelte-icons/md/MdRemove.svelte'

    let current_view = {
        id: id,
        ...view
    };
    $: current_view = $config[id];

    function ToggleEnabled (ev) {
      const message_promise = UpdateEnable( id );
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

<style>
  .icon {
    width: 32px;
    height: 32px;
  }
</style>

<div class="bg-grey-light border m-4 border-gray-400 rounded-b p-4 leading-normal">

  <div class="flex justify-between">
    <div on:click={ToggleEnabled}>
      {#if current_view['enabled']}
        <div class="mt-3 inline-flex items-center cursor-pointer">
            <span class="relative">
                <span class="block w-10 h-6 bg-gray-400 rounded-full shadow-inner"></span>
                <span class="absolute block w-4 h-4 mt-1 ml-1 rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out bg-purple-600 transform translate-x-full">
                </span>
            </span>
            <span class="ml-3 text-sm">Enabled</span>
          </div>
      {:else}
        <div class="mt-3 items-center inline-flex cursor-pointer">
            <span class="relative">
              <span class="block w-10 h-6 bg-gray-400 rounded-full shadow-inner"></span>
              <span class="absolute block w-4 h-4 mt-1 ml-1 bg-white rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out">
              </span>
            </span>
            <span class="ml-3 text-sm">Disabled</span>
          </div>
      {/if}
    </div>

    <div>
      <button on:click={() => { Delete(id) }} class="hover:bg-grey-light">
        <div class="icon bg-white rounded-full h-16 w-16 flex items-center justify-center">
          <MdRemove />
        </div>
      </button>
    </div>
  </div>

  <Link to="/view/{id}">
      <div class="h-32 bg-cover overflow-hidden" style="background-image: url('images/{current_view.background}')" title="Some gauge">
          <div class="h-24 bg-cover overflow-hidden" style="background-image: url('images/{current_view.theme}.png')" title="Some gauge"></div>
      </div>
      <div class="text-gray-700 m-2 text-center font-bold text-xl">
          {current_view.name}
      </div>
      <div class="flex space-x-1">
          {#each current_view.pids as pid}
          <div class="bg-blue-400 rounded-lg text-center w-1/3 text-gray-800">
              {$constants[pid].shortName}
          </div>
          {/each}
      </div>
  </Link>
</div>
