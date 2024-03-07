import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	// If there are no projects, return an empty array
	if ((await prisma.project.count()) === 0) {
		return {
			project: null,
			error: 'No projects available.',
		};
	}

	// Get the current judge
	let judgeCode = url.searchParams.get('code');
	if (!judgeCode) {
		return {
			project: null,
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
			project: null,
			error: 'No judge found with that code.',
		};
	}

    // If judge is done, return an error
    if (judge.done) {
        return {
            project: null,
			error: "done",
        };
    }

    // If the judge is supposed to be ranking, return an error
    if (judge.isRanking) {
        return {
            project: null,
            error: 'ranking',
        };
    }

	// If the judge is on a project, return that project
	if (judge.currentNumber !== -1) {
		return {
			project: judge.currentNumber,
			numSeen: judge.ratings.length,
			judgeName: judge.name,
		};
	}

	// Otherwise, select a random project
	return prisma.$transaction(async (tx) => {
		// Get the minimum seen value
		const minSeenRes = await tx.project.aggregate({
			_min: {
				seen: true,
			},
		});
		const minSeen = minSeenRes._min.seen ?? 0;

		const projects = await tx.project.findMany({
			where: {
				seen: {
					lte: minSeen,
				},
			},
		});

		// Get the projects that all judges are on
		const judges = await tx.judge.findMany({
			select: {
				currentNumber: true,
			},
			where: {
				done: false,
			},
		});
		const currJudging = judges.map((judge) => judge.currentNumber).filter((num) => num !== -1);
		const seenProjects = judge.ratings.map((rating) => rating.number);

		// Get the projects that have not been seen by the current judge
		const unseenProjects = projects.filter((project) => !seenProjects.includes(project.number));

		// If all projects have been seen, return an error
		if (unseenProjects.length === 0) {
			return {
				project: null,
				error: 'All projects have been seen.',
			};
		}

		// Get the projects that no judge is on
		const freeProjects = unseenProjects.filter((project) => !currJudging.includes(project.number));

		// If there are no free projects, return a random project
		let nextProj = -1;
		if (freeProjects.length === 0) {
			nextProj = unseenProjects[Math.floor(Math.random() * projects.length)].number;
		} else {
			// Otherwise, return a random free project
			nextProj = freeProjects[Math.floor(Math.random() * freeProjects.length)].number;
		}

		// Update the judge's current project
		await tx.judge.update({
			where: {
				code: judgeCode as string,
			},
			data: {
				currentNumber: nextProj,
			},
		});

		return {
			project: nextProj,
			numSeen: judge.ratings.length,
			judgeName: judge.name,
		};
	});
}) satisfies PageServerLoad;
