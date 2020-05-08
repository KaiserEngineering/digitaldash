<script>
    import { beforeUpdate } from "svelte";

    export let view;

    let src = '/Users/craigkaiser/kaiserengineering/DigitalDash_GUI/static/imgs/Stock/gauge.png';

    // $: fetch(`https://node-hnapi.herokuapp.com/news?page=${page}`)
    //     .then(r => r.json())
    //     .then(data => {
    //         items = data;
    //         offset = PAGE_SIZE * (page - 1);
    //         window.scrollTo(0, 0);
    //     });
</script>

<style>
    .gauge {
        width: 20%;
    }

    a {
        padding: 2em;
        display: block;
    }

    .loading {
        opacity: 0;
        animation: 0.4s 0.8s forwards fade-in;
    }

    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }
</style>

<div>
    <p>Name: {view.name}</p>
    {#each view.gauges as gauge}
        <div class="gauge">
            <img {src} alt="nah" />
        </div>
    {/each}
</div>
