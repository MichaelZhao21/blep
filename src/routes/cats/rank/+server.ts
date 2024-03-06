import prisma from '$lib/prisma';
import { text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { code, ranking } = await request.json();

	// Wrap in transaction
	return prisma.$transaction(async (tx) => {
		// Get the current judge
		const judge = await tx.judge.findFirst({
			where: {
				code,
			},
		});
		if (!judge) {
			return text('Invalid judge code', { status: 401 });
		}

		// Add the judge rankings
		await tx.judge.update({
			where: {
				code,
			},
			data: {
				rankings: ranking.map((r: DropItem) => r.id),
				isRanking: false,
				done: ranking.length >= 30 ? true : false,
				currentNumber: -1,
			},
		});

		return text('Success');
	});
};
