<script>
    export let view;
    export let id;
    import { Link } from "svelte-routing";

    let gauge = './gauge.png';
</script>

<Link to="/view/{id}">
    <div class="h-48 lg:h-auto lg:w-10 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden" style="background-image: url('images/{view.theme}.png')" title="Some gauge"></div>
        <div class="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
            <div class="mb-8">
            <p class="text-sm text-gray-200 flex items-center">
                dynamic
            </p>
            <div class="text-gray-300 font-bold text-xl mb-2">{view.name}</div>
        </div>
        <div class="flex items-center">
            <div class="text-sm">
                {#each view.pids as pid}
            <p class="text-gray-400 leading-none">{pid}</p>
                {/each}
            </div>
        </div>
    </div>
</Link>
