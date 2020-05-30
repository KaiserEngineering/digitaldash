import { writable } from 'svelte/store';
import { is_client } from 'svelte/internal';

export let config = writable( {} );
export let constants = writable( {} );

async function getConstants() {
    const res  = await fetch('http://localhost:3000/api/constants');
    const cons = await res.json();

    constants.set(cons);
}

getConstants();
