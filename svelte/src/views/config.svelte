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
    const sortList = ev => { list = ev.detail };
</script>

<div class="justify-center items-center">
    <div class="text-grey max-w-xs mx-auto mb-6">
        Configure the Digital Dash background, gauge styles,
        parameters, alerts and dynamic triggers.
    </div>

    <div class="m-4">
        <button class="m-4 bg-blue-500 rounded-lg p-2" on:click="{getConfig}">Reload Config</button>
    </div>

    {#await promise}
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
