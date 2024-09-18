export async function load({ locals }) {
    // @ts-ignore
    return { config: locals.configuration, constants: locals.constants };
}
