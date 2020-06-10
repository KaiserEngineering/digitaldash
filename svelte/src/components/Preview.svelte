<script>
    export let view;
    export let id;
    import { Link } from "svelte-routing";
    import { constants } from '../store.js';

    let enabled = true;

    let gauge = './gauge.png';
</script>

<div class="bg-grey-light border m-4 border-gray-400 rounded-b p-4 leading-normal">
    <div on:click={()=> { enabled=!enabled }}>
        {#if enabled}
            <label for="checked" class="mt-3 inline-flex items-center cursor-pointer">
                <span class="relative">
                <span class="block w-10 h-6 bg-gray-400 rounded-full shadow-inner"></span>
                <span class="absolute block w-4 h-4 mt-1 ml-1 rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out bg-purple-600 transform translate-x-full">
                    <input id="checked" type="checkbox" class="absolute opacity-0 w-0 h-0" />
                </span>
                </span>
                <span class="ml-3 text-sm">Enabled</span>
            </label>
        {:else}
            <label for="unchecked" class="mt-3 inline-flex items-center cursor-pointer">
                <span class="relative">
                <span class="block w-10 h-6 bg-gray-400 rounded-full shadow-inner"></span>
                <span class="absolute block w-4 h-4 mt-1 ml-1 bg-white rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out">
                    <input id="unchecked" type="checkbox" class="absolute opacity-0 w-0 h-0" />
                </span>
                </span>
                <span class="ml-3 text-sm">Disabled</span>
            </label>
        {/if}
    </div>

    <Link to="/view/{id}">
        <div class="h-32 bg-cover overflow-hidden" style="background-image: url('images/{view.background}')" title="Some gauge">
            <div class="h-24 bg-cover overflow-hidden" style="background-image: url('images/{view.theme}.png')" title="Some gauge"></div>
        </div>
        <div class="text-gray-700 m-2 text-center font-bold text-xl">
            {view.name}
        </div>
        <div class="flex space-x-1">
            {#each view.pids as pid}
            <div class="bg-blue-400 rounded-lg text-center w-1/3 text-gray-800">
                {$constants[pid].shortName}
            </div>
            {/each}
        </div>
    </Link>
</div>
