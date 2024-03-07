import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	// Get the current judge
	let judgeCode = url.searchParams.get('code');
	if (!judgeCode) {
		return {
			projects: [],
			rankings: [],
			error: 'No judge code provided.',
		};
	}

	const judge = await prisma.judge.findFirst({
		where: {
			code: judgeCode,
		},
	});
	if (!judge) {
		return {
			projects: [],
			rankings: [],
			error: 'No judge found with that code.',
		};
	}

	// If the judge is supposed to be rating, return an error
	// Ignore this condition if judge is done
	if (!judge.done && !judge.isRanking) {
		return {
			projects: [],
			rankings: [],
			error: 'rating',
		};
	}

	return {
		projects: judge.ratings,
		rankings: judge.rankings,
	};
}) satisfies PageServerLoad;
