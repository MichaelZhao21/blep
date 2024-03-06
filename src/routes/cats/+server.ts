import prisma from '$lib/prisma';
import { text, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { code, number, rating } = await request.json();

	// Wrap in transaction
	return prisma.$transaction(async (tx) => {
		// Get the judge
		const judge = await tx.judge.findFirst({
			where: {
				code,
			},
		});
		if (!judge) {
			return text('Invalid judge code', { status: 401 });
		}

		// Add the project to the judge rankings
		await tx.judge.update({
			where: {
				code,
			},
			data: {
				ratings: {
					push: {
						number,
						score: rating,
					},
				},
				isRanking: true,
			},
		});

		// Update the project's seen count
		await tx.project.update({
			where: {
				number,
			},
			data: {
				seen: {
					increment: 1,
				},
			},
		});

		return text('Success');
	});
};

export const PUT: RequestHandler = async ({ request }) => {
	const { code, number, rating } = await request.json();
	return prisma.$transaction(async (tx) => {
		// Get the judge
		const judge = await tx.judge.findFirst({
			where: {
				code,
			},
		});
		if (!judge) {
			return text('Invalid judge code', { status: 401 });
		}

		// Find the rating to change
		const ratingInd = judge.ratings.findIndex((r) => r.number === number);
		if (ratingInd === -1) {
			return text('Invalid project number', { status: 400 });
		}

		// Update the rating
		judge.ratings[ratingInd].score = rating;

		// Update the judge ratings
		await tx.judge.update({
			where: {
				code,
			},
			data: {
				ratings: judge.ratings,
			},
		});

		return text('Success');
	});
};
