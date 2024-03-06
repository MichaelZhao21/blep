import prisma from '$lib/prisma';
import { text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { start, end } = await request.json();
	for (let i = start; i <= end; i++) {
		await prisma.project.create({
			data: {
				number: i,
				seen: 0,
			},
		});
	}

	return text('Success');
};
