<script lang="ts">
	import type { Judge } from '@prisma/client';

	export let judges: Judge[] = [];

	const PROJECT_COUNT = 103;
	let projects = new Array(PROJECT_COUNT).fill(0).map((_) => ({
		seen: 0,
		rankings: 0,
	}));

	// Combine judge rankings
	const allRanks = judges.map((judge) => judge.rankings).flat();

	// Count the number of times each project is in the top 10
	allRanks.forEach((num) => {
		projects[num].rankings++;
	});

	// Combine judge ratings
	const allRatings = judges.map((judge) => judge.ratings).flat();
	allRatings.forEach((rating) => {
		projects[rating.number].seen++;
	});
</script>

{#if judges.length > 0}
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
			</tr>
		</thead>
		<tbody>
			{#each projects as proj, i}
				<tr>
					<td>{i}</td>
					<td>{proj.rankings}</td>
					<td>{proj.seen}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<p>Loading...</p>
{/if}
