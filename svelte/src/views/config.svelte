<script>
    import Preview from '../components/Preview.svelte';
    import SortableList from 'svelte-sortable-list';
    import { config, getConfig } from '../store.js';

    let promise = getConfig();

    let list = [];
    promise.then( (val) => {
        list = Object.keys( $config ).map(e => {
            return {
                id: e,
                ...$config[e]
            };
        });
    });
    const sortList = ev => {
        list = ev.detail
    };
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

<div class="sm:w-full md:w-1/2 mx-auto flex-1 justify-center items-center">
    {#await promise}
        <span>...Loading</span>
    {:then}
        <SortableList
            {list}
            on:sort={sortList}
            let:item
            let:index
        >
        <div class="m-4">
            <Preview view={item} id={item.id} />
        </div>

        </SortableList>
    {/await}
</div>
