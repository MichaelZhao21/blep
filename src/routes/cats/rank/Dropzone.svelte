<script lang="ts">
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	export let items: DropItem[] = [];
	export let code = '';
	const flipDurationMs = 200;

	let preview = -1;
	let rating = 1;

	function handleSort(e: CustomEvent<DndEvent<DropItem>>) {
		items = e.detail.items;
	}

	const updateRating = async () => {
		const res = await fetch('/cats', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ code, number: preview, rating }),
		});

		if (!res.ok) {
			alert('Could not update rating :(');
			return;
		}

		const prevInd = items.findIndex((i) => i.id === preview);
		items[prevInd] = {
			id: preview,
			score: rating,
		};

		preview = -1;
		rating = 1;
	};
</script>

<section
	use:dndzone={{ items, flipDurationMs }}
	on:consider={handleSort}
	on:finalize={handleSort}
	class="zone"
>
	{#each items as item (item.id)}
		<div class="item" animate:flip={{ duration: flipDurationMs }}>
			{#if !isNaN(item.id)}
				<button
					on:click={() => {
						preview = item.id;
						rating = item.score;
					}}
					class="thumb-butt"
				>
					<img
						src={`https://cdn.michaelzhao.xyz/cats/thumbnails/${item.id}.png`}
						alt={`cat thumbnail ` + item.id}
						class="thumb"
					/>
				</button>
			{/if}
			<div class="item-text">
				<span style="font-weight: bold;">Cat number {item.id}</span>
				<span>Score: {item.score}</span>
			</div>
		</div>
	{/each}
</section>

{#if preview !== -1}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="background"
		on:click={() => {
			preview = -1;
			rating = 1;
		}}
	></div>
	<div class="popup">
		<img
			src={`https://cdn.michaelzhao.xyz/cats/photos/${preview}.png`}
			alt={'cat image number ' + preview}
			class="cat"
		/>
		<p>Cat number {preview}</p>

		<p style="margin-bottom: 0;">Rating: {rating}</p>
		<input bind:value={rating} type="range" min="1" max="10" step="1" /><br />
		<button on:click={updateRating} class="butt">Update</button>
	</div>
{/if}

<style>
	.zone {
		width: calc(100% - 4rem);
		padding: 1rem;
		border: 2px dashed #000;
		margin-bottom: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.item {
		width: calc(100% - 1rem);
		border: 1px solid #000;
		padding: 0.5rem;
		display: flex;
		align-items: center;
		min-height: 4rem;
	}

	.item-text {
		display: flex;
		flex-direction: column;
	}

	.thumb {
		max-width: 4rem;
		max-height: 4rem;
		height: auto;
	}

	.thumb-butt {
		background-color: transparent;
		border: none;
		cursor: pointer;
		margin: 0;
		margin-right: 1rem;
		padding: 0;
	}

	.background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 100;
	}

	.popup {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 80%;
		max-width: 30rem;
		background-color: white;
		padding: 1rem;
		z-index: 101;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.cat {
		max-height: 20rem;
		max-width: 30rem;
		height: auto;
		width: auto;
		object-fit: scale-down;
	}
</style>
