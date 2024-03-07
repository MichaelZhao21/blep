<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Container from '$lib/components/Container.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const code = $page.url.searchParams.get('code');
	let number = -1;
	let rating = 1;
	let numSeen = 0;
	let name = '';

	// Checks to make on load
	const onload = () => {
		// Make sure code exists
		if (!code) {
			goto(
				'/cats/sad?error=No code provided. You must have a valid code to access the cat page. Please contact an admin for access',
			);
			return;
		}

		// Check if judge is ranking
		if (data.error && data.error === 'ranking') {
			goto('/cats/rank?code=' + code);
			return;
		}

		// Check if project is valid
		if (data.project === null || data.project === undefined) {
			goto('/cats/sad?error=' + data.error);
			return;
		}

		number = data.project;
		numSeen = data.numSeen ?? 0;
		name = data.judgeName ?? '';
	};

	if (browser) {
		onload();
	}

	const submit = async () => {
		const res = await fetch('/cats', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ code, number, rating }),
		});

		if (res.ok) {
			goto('/cats/rank?code=' + code);
		} else {
			if (res.status === 400) {
				alert(
					'Your code is invalid! Please make sure you use the correct link to access the cat page.',
				);
				return;
			}
			alert('Failed to submit rating. Please contact an admin for help :(');
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
		second page). You may change your ranking at any time after viewing a cat. Please go through 30
		cats to complete judging, ranking cats between each viewing.
	</p>
	{#if number !== -1}
		<h2 style="margin-bottom: 0.5rem;">Please Rate the Cat Art</h2>
		<p style="margin-top: 0; margin-bottom: 2rem;">
			Hi {name}! You have seen {numSeen}/30 cats :3
		</p>
		<img
			src={`https://cdn.michaelzhao.xyz/cats/photos/${number}.png`}
			alt={'cat image number ' + number}
			class="cat"
		/>
		<p>Cat number {number}</p>

		<p style="margin-bottom: 0;">Rating: {rating}</p>
		<input bind:value={rating} type="range" min="1" max="10" step="1" /><br />
		<button on:click={submit} class="butt">Submit</button>
	{:else}
		<p>Loading...</p>
	{/if}
</Container>

<style>
	.cat {
		max-height: 20rem;
		width: auto;
	}

	.butt {
		margin-top: 1rem;
	}
</style>
