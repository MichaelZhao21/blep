import prisma from '$lib/prisma';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { name } = await request.json();
	const code = generateCode();
	await prisma.judge.create({
		data: {
			name,
			code,
			rankings: [],
			ratings: [],
		},
	});

	return json({ code });
};

function generateCode() {
	return Array.from(Array(12), () => Math.floor(Math.random() * 36).toString(36)).join('');
}
