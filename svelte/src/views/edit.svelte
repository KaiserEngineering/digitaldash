<script>
    export let id;
    import PIDList from '../components/PIDList.svelte';
    import Select from '../components/Select.svelte';
    import { config, UpdateConfig } from '../store.js';
    import { getNotificationsContext } from 'svelte-notifications';

    const { addNotification } = getNotificationsContext();

    let current_view = {
        id: id,
        ...$config[id]
    };
    if ( ! current_view.alerts.length ) {
        current_view.alerts[0] = {
               "message" : "",
               "op" : "",
               "pid" : "",
               "priority" : "",
               "value" : ""
        }
    }

    let gauge_themes = ['Stock', 'Modern', 'Linear', 'Dirt', 'Glow'];
    let backgrounds  = ['banner1.jpg', 'bg.jpg', 'CarbonFiber.png', 'BlackBackground.png'];

    function Update() {
        const message_promise = UpdateConfig(current_view, config);
        message_promise.then((res) => {
            addNotification({
                text: res,
                position: 'top-center',
            });
        });
    }
    $: current_view = $config[id];
</script>

<div class="w-full">
    <div class="container mx-auto px-6 pb-6 -mt-20">
        <div class="lg:max-w-md flex-1 bg-white rounded-lg shadow p-6">
            <h1 class="font-semibold text-md">
                Editing config
            </h1>
            <h4 class="inline-block py-2">
                Some more notes
            </h4>
        </div>
    </div>
</div>

<div class="px-4 lg:w-1/2 justify-center flex mx-auto">
    <div class="p-4 rounded-lg overflow-hidden border border-gray-400">
        <form on:submit|preventDefault="{Update}">
            <div class="flex flex-wrap w-full content-center -mx-2 mb-2">
                <div class="inline-block relative w-64 w-full p-2">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="name">
                        View Name
                    </label>
                    <input bind:value={current_view.name} name="name" class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" id="name" type="text">
                </div>
            </div>

            <div class="flex flex-wrap w-full content-center -mx-2 mb-2">

                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        Background
                    </label>
                        <Select
                            Name="background"
                            List={backgrounds}
                            Default={current_view.background}
                            Current={current_view}
                        />
                </div>

                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
                        Gauges
                    </label>
                    <div class="relative">
                        <select bind:value={current_view.theme} name="theme" class="block truncate appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                            {#each gauge_themes as theme}
                            <option class:selected={current_view.theme == theme} value="{theme}">{ theme }</option>
                            {/each}
                        </select>
                    </div>
                </div>

            </div>

            <div class="flex flex-wrap w-full content-center -mx-2 mb-2">

                <div class="inline-block relative w-64 w-full p-2">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold">
                        Vehicle Parameters
                    </label>
                </div>

                {#each current_view.pids as pid, index}
                <div class="w-1/3 px-3 mb-6 md:mb-0">
                    <PIDList
                        Name="pids"
                        Default={pid}
                        Current={current_view}
                    />
                </div>
                {/each}
            </div>


            <div class="flex flex-wrap w-full content-center -mx-2 mb-2">

                <div class="inline-block relative w-64 w-full p-2">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold">
                        Alerts
                    </label>
                </div>

                <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
                        Parameter
                    </label>

                    <PIDList
                        Name="alertIndex"
                        Default={current_view.alerts[0].pid}
                        Current={current_view}
                    />

                </div>

                <div class="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
                        Operator
                    </label>

                    <Select
                        Name="alertOperator"
                        List={['=', '>', '<', '>=', '<=']}
                        Default={current_view.alerts[0].op}
                        Current={current_view}
                    />

                </div>

                <div class="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        Value
                    </label>
                    <div class="relative">
                        <input bind:value={current_view.alerts[0].value} name="alertValue" class="appearance-none shadow w-full text-gray-700 border rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text">
                    </div>
                </div>

                <div class="w-full md:w-1/6 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        priority
                    </label>
                    <div class="relative">
                        <input bind:value={current_view.alerts[0].priority} name="alertPriority" class="appearance-none shadow w-full text-gray-700 border rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="number">
                    </div>
                </div>

                <div class="w-full px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        Message
                    </label>
                    <div class="relative">
                        <input bind:value={current_view.alerts[0].message} name="alertMessage" class="appearance-none shadow w-full text-gray-700 border rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text">
                    </div>
                </div>

            </div>

            <div class="flex flex-wrap w-full content-center -mx-2 mb-2">

                <div class="inline-block relative w-64 w-full p-2">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold">
                        Dynamic
                    </label>
                </div>

                <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
                        Parameter
                    </label>

                    <PIDList
                        Name="dynamicParameter"
                        Default={current_view.dynamic.pid}
                        Current={current_view}
                    />

                </div>

                <div class="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
                        Operator
                    </label>

                    <Select
                        Name="dynamicOperator"
                        List={['=', '>', '<', '>=', '<=']}
                        Default={current_view.dynamic.op}
                        Current={current_view}
                    />

                </div>

                <div class="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        Value
                    </label>
                    <div class="relative">
                        <input bind:value={current_view.dynamic.value} name="dynamicValue" class="appearance-none shadow w-full text-gray-700 border rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text">
                    </div>
                </div>

                <div class="w-full md:w-1/6 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        priority
                    </label>
                    <div class="relative">
                        <input bind:value={current_view.dynamic.priority} name="dynamicPriority" class="appearance-none shadow w-full text-gray-700 border rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="number">
                    </div>
                </div>

            </div>

            <button class="shadow bg-grey-dark hover:bg-grey-darkest focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">Update</button>
        </form>
    </div>
</div>