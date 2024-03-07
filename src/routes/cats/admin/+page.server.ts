import { ADMIN_PASSWORD } from '$env/static/private';
import prisma from '$lib/prisma.js';

export const load = async ({ url }) => {
	let password = url.searchParams.get('password');
	if (password !== ADMIN_PASSWORD) {
		return {
			error: 'Incorrect password.',
		};
	}

    // Get all judges
    const judges = await prisma.judge.findMany();
    return {
        judges,
    }
};
