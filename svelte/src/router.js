import Config from './views/config.svelte';
import Edit from './views/edit.svelte';
import { writable } from 'svelte/store';

export let page = { path: '/',name: 'Config' };

const router = {
    '/': Config,
    '/view': Edit
};

export function redirectTo(event){
    if ( typeof event.detail === 'object' ) {
        // change current router path
        curRoute.set(event.detail.target.pathname);
    }
    else {
        curRoute.set(event.target.pathname);
    }
    // push the path into web browser history API
    window.history.pushState({path: page.path}, '',
    window.location.origin + page.path);
}

export default router;

export const curRoute = writable('/');
