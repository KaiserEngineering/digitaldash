import type { Handle } from '@sveltejs/kit';
import { GetConstants } from '$lib/server/Constants';
import { ReadFile } from '$lib/server/Util';

export const handle: Handle = async ({ event, resolve }) => {
    // Create our session object
    event.locals.actions = [];
    event.locals.count = 0;

    // Read in our static content
    event.locals.configuration = ReadFile('/etc/config.json');

    event.locals.constants = await GetConstants();

    const response = await resolve(event);
    return response;
};
