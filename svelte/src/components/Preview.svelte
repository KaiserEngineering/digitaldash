<script>
    export let view;
    export let id;
    import { Link } from "svelte-routing";
    import { constants } from '../store.js';

    let gauge = './gauge.png';
</script>

<div class="bg-gray-200 border-r border-t m-4 border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
    <Link to="/view/{id}">
        <div class="h-32 flex-none bg-cover overflow-hidden" style="background-image: url('images/{view.background}')" title="Some gauge">
            <div class="h-24 flex-none bg-cover overflow-hidden" style="background-image: url('images/{view.theme}.png')" title="Some gauge"></div>
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
