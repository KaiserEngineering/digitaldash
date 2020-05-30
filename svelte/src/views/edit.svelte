<script>
    export let id;
    import PIDList from '../components/PIDList.svelte';
    import Select from '../components/Select.svelte';
    import { config, UpdateConfig } from '../store.js';

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
        UpdateConfig(current_view);
    }
</script>

<div class="bg-white rounded-t-lg overflow-hidden border-t border-b border-l border-r border-gray-400 p-4 flex justify-center p-8">
    <form on:submit|preventDefault="{Update}" class="w-full max-w-lg">
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
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
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
            <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
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

        <button class="shadow bg-blue-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">Update</button>
    </form>
</div>
