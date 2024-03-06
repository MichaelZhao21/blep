<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	let start = 0;
	let end = 10;
	let name = '';
	let code = '';
	let loaded = false;

	const submitAddProjects = async () => {
		const res = await fetch('/cats/admin/projects', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ start, end }),
		});

		if (res.ok) {
			console.log('Projects added');
		} else {
			console.error('Failed to add projects');
		}
	};

	const submitAddName = async () => {
		const res = await fetch('/cats/admin/judges', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name }),
		});

		if (res.ok) {
			console.log('Judge added');
			const data = await res.json();
			code = data.code;
		} else {
			console.error('Failed to add judge');
		}
	};

	if (browser && data.error) {
		goto(`/cats/sad?error=You must have a valid password to access the admin page`);
	} else if (browser) {
		loaded = true;
	}
</script>

{#if loaded}
	<div style="margin: 0 1rem;">
		<h1>Add Projects</h1>

		<input bind:value={start} type="number" id="start-input" />
		<label for="start-input">Start</label>

		<br />

		<input bind:value={end} type="number" id="end-input" />
		<label for="end-input">End</label>

		<br />

		<button on:click={submitAddProjects}>Add Projects in range</button>

		<h1>Add Judges</h1>

		<input bind:value={name} type="text" id="name-input" />
		<label for="name-input">Name</label>

		<br />

		<button on:click={submitAddName}>Add Judge</button>

		{#if code}
			<p>Last Judge Added: {code}</p>
			<a href={`https://blep.mikz.dev/cats?code=${code}`}>
				{`https://blep.mikz.dev/cats?code=${code}`}
			</a>
		{/if}
	</div>
{:else}
	<p>Loading...</p>
{/if}
