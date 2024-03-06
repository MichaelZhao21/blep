import { ADMIN_PASSWORD } from '$env/static/private';

export const load = (async ({url}) => {
    let password = url.searchParams.get('password');
    if (password !== ADMIN_PASSWORD) {
        return {
            error: 'Incorrect password.',
        };
    }
})