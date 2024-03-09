<script lang="ts">
	import type { Judge } from '@prisma/client';

	export let judges: Judge[] = [];

	const PROJECT_COUNT = 103;
	let projects = new Array(PROJECT_COUNT).fill(0).map((_) => ({
		seen: 0,
		rankings: 0,
		rcScore: 0,
	}));

	// Combine judge rankings
	const allRanks = judges.map((judge) => judge.rankings).flat();

	// Count the number of times each project is in the top 10
	allRanks.forEach((num) => {
		projects[num].rankings++;
	});

	// Perform ranked choice voting
	judges.forEach((judge) => {
		judge.rankings.forEach((num, i) => {
			projects[num].rcScore += judge.rankings.length - i;
		});
	});

	// Combine judge ratings
	const allRatings = judges.map((judge) => judge.ratings).flat();
	allRatings.forEach((rating) => {
		projects[rating.number].seen++;
	});

	// Get all users that judged more than 15 projects and actually ranked at least 3 cats
	const filteredJudges = judges.filter(
		(judge) => judge.ratings.length > 15 && judge.rankings.length > 2,
	);
	const filteredJudgesStr = filteredJudges.map((j) => `'${j.name}'`).join(', ');
	const filteredJudgesRankings = filteredJudges
		.map(
			(j) =>
				`[${j.rankings.toString()},(${j.ratings
					.map((r) => r.number)
					.filter((r) => j.rankings.indexOf(r) === -1)
					.toString()})]`,
		)
		.join(',\n');

	// Get all projects
	const n = projects.length;

	// Get the average number of times a project was seen
	const avgSeen = projects.reduce((acc, proj) => acc + proj.seen, 0) / n;
</script>

{#if judges.length > 0}
	<h1>Output</h1>
	<p><b>Users</b></p>
	<pre>{filteredJudgesStr}</pre>
	<p><b>n</b></p>
	<pre>{n}</pre>
	<p><b>Rankings</b></p>
	<pre>{filteredJudgesRankings}</pre>
	<p><b>Avg Seen</b></p>
	<pre>{avgSeen}</pre>

	<h1>Judge List</h1>
	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Code</th>
				<th>Rated</th>
				<th>Top 10</th>
			</tr>
		</thead>
		<tbody>
			{#each judges as judge}
				<tr>
					<td>{judge.name}</td>
					<td>{judge.code}</td>
					<td>{judge.ratings.length}</td>
					<td>{judge.rankings.join(', ')}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<h1>Projects List</h1>
	<table>
		<thead>
			<tr>
				<th>#</th>
				<th>T10</th>
				<th>Seen</th>
				<th>RC Score</th>
			</tr>
		</thead>
		<tbody>
			{#each projects as proj, i}
				<tr>
					<td>{i}</td>
					<td>{proj.rankings}</td>
					<td>{proj.seen}</td>
					<td>{proj.rcScore}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<p>Loading...</p>
{/if}
