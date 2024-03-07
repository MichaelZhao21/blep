<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Container from '$lib/components/Container.svelte';
	import type { PageData } from './$types';
	import Dropzone from './Dropzone.svelte';

	export let data: PageData;

	const code = $page.url.searchParams.get('code');
	let projects: Rating[] = [];
	let ranked: DropItem[] = [];
	let notRanked: DropItem[] = [];

	// Checks to make on load
	const onload = () => {
		// Make sure code exists
		if (!code) {
			goto(
				'/cats/sad?error=No code provided. You must have a valid code to access the cat page. Please contact an admin for access',
			);
			return;
		}

		// Make sure code is valid
		if (data.projects.length === 0) {
			if (data.error === 'rating') {
				goto('/cats?code=' + code);
				return;
			} else {
				goto(`/cats/sad?error=${data.error}`);
				return;
			}
		}

		projects = data.projects;
		const ratings = data.rankings as number[];

		// Calculate the not rated projects
		notRanked = projects
			.filter((project: Rating) => !ratings.includes(project.number))
			.map((p) => ({
				id: p.number,
				score: p.score,
			})).reverse();
		ranked = ratings.map((r) => ({
			id: r,
			score: projects.find((p) => p.number === r)?.score ?? 0,
		}));
	};

	if (browser) {
		onload();
	}

	const submit = async () => {
		const res = await fetch('/cats/rank', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ code, ranking: ranked }),
		});

		if (res.ok) {
			goto(`/cats?code=${code}`);
		} else {
			if (res.status === 400) {
				alert(
					'Your code is invalid! Please make sure you use the correct link to access the cat page.',
				);
				return;
			}
			alert('Failed to submit ranking. Please contact an admin for help :(');
		}
	};
</script>

<Container>
	<h1>Cat Art Ranker</h1>
	<p>
		You will be helping judge art of cats (to simulate judging hackathon projects)! You will be
		presented one cat at a time. Please give each cat a score when you see it (10 best, 1 worst).
	</p>
	<p>
		After viewing the cat, you will be asked to place it in the ranking with other cats. (On the
		second page). You may change your ranking at any time after viewing a cat.
	</p>

	{#if projects.length > 0}
		<h2>Please Rank the Cat Arts</h2>
		<p style="margin-top: 0.25rem">
			Please rank UP TO TEN cats. You can click on the cat to change the score or view it
			again. Drag and drop anywhere else on the item to change its ordering.
		</p>

		<h3>Ranking (order matters, limit 10)</h3>
		<Dropzone bind:items={ranked} code={code ?? ""} limit={10} />
		<h3>Unranked (order does not matter)</h3>
		<Dropzone bind:items={notRanked} code={code ?? ""} />
		<button on:click={submit} style="margin-bottom: 1rem;">Done Ranking</button>
	{:else}
		<p>Loading...</p>
	{/if}
</Container>

<style>
</style>
