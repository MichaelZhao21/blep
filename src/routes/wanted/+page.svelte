<script lang="ts">
	import { onMount } from 'svelte';

	let canvasElement: HTMLCanvasElement;
	let printerFriendly: boolean = false;
	let wantedFor: String = 'robbery';
	let dead: boolean = true;
	let alive: boolean = true;
	let imageSrc: string = '/images/cat.webp';
	let sepia: boolean = false;
	let name: string = 'John Doe';
	let reward: string = '$10,000';
	let extra: string =
		'Be warned this is a dangerous individual!\nApproach with the utmost caution.\nSuspect is armed and WILL BITE!';

	const redraw = async () => {
		const ctx = getContext();
		if (!ctx) return;

		ctx.filter = '';

		// Draw background
		if (!printerFriendly) {
			await new Promise((resolve, _) => {
				const img = document.createElement('img');
				img.src = '/images/wanted.jpg';
				img.onload = () => {
					ctx.drawImage(img, 0, 0);
					resolve(null);
				};
			});
		}

		// Draw text
		ctx.font = '100px Nashville';
		ctx.fillStyle = 'black';
		ctx.textAlign = 'center';
		ctx.fillText('WANTED', canvasElement.width / 2, 120);

		// Draw wanted for
		ctx.font = '32px Nashville';
		ctx.fillText('For ' + wantedFor, canvasElement.width / 2, 160);

		// Draw dead or alive
		const daText =
			!dead && !alive
				? '== Neither Dead nor Alive =='
				: dead && alive
					? '-=-= Dead or Alive =-=-'
					: dead
						? '= = = =  Dead  = = = ='
						: '---- Alive ----';
		ctx.font = '50px Nashville';
		ctx.fillText(daText, canvasElement.width / 2, 215);

		// Draw image
		await new Promise((resolve, _) => {
			const img = document.createElement('img');
			img.src = imageSrc;
			img.onload = () => {
				// Resize img
				const w = img.width * (300 / img.height);
				const h = 300;

				const x = 311 - w / 2;

				ctx.fillRect(x - 3, 247, w + 6, h + 6);
				ctx.filter = sepia ? 'sepia(1)' : 'sepia(0)';
				ctx.drawImage(img, x, 250, w, h);
				ctx.filter = 'sepia(0)';
				resolve(null);
			};
		});

		// Draw name
		ctx.font = '40px Freshman';
		ctx.fillText(name.toUpperCase(), canvasElement.width / 2, 610);

		// Draw reward
		const px = reward.length < 5 ? 60 : reward.length < 12 ? 50 : reward.length < 15 ? 40 : 30;
		ctx.font = `${px}px Freshman`;
		ctx.fillText(`REWARD: ${reward}`, canvasElement.width / 2, 670);

		// Draw extra
		const extras = extra.split('\n');
		ctx.font = '16px Freshman';
		extras.forEach((e, i) => {
			ctx.fillText(e, canvasElement.width / 2, 700 + i * 16);
		});
	};

	const getContext = () => {
		const ctx = canvasElement.getContext('2d');

		if (!ctx) {
			alert('IMAGE DID NOT LOAD THIS WILL NOT WORK ERROR ERROR ERROR ERROR ERROR ERROR ERROR :(');
			return;
		}

		return ctx;
	};

	const onFileSelected = (e: any) => {
		const image = e.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (e: any) => {
			imageSrc = e.target.result;
			redraw();
		};
	};

	const save = () => {
		const data = canvasElement.toDataURL('image/jpg', 1.0);
		const a = document.createElement('a');
		a.href = data;
		a.download = 'wanted.jpg';
		document.body.appendChild(a);
		a.click();
		alert('Image download started!');
	};

	onMount(redraw);
</script>

<h1>Wanted Poster Creator!</h1>

<div class="container">
	<canvas bind:this={canvasElement} id="poster" width="622" height="776" />

	<form id="form">
		<label for="wanted-for">Wanted for&nbsp;</label>
		<input type="text" id="wanted-for" name="wanted-for" on:input={redraw} bind:value={wantedFor} />

		<br />

		<label for="dead-check">Dead</label>
		<input
			type="checkbox"
			id="dead-check"
			name="dead-check"
			on:change={redraw}
			bind:checked={dead}
		/>
		<label for="alive-check">Alive</label>
		<input
			type="checkbox"
			id="alive-check"
			name="alive-check"
			on:change={redraw}
			bind:checked={alive}
		/>

		<br />

		<label for="upload">Image</label>
		<input
			type="file"
			accept="image/jpg, image/jpeg, image/png"
			id="upload"
			name="upload"
			on:change={onFileSelected}
		/>

		<br />

		<label for="sepia">Make image sepia</label>
		<input type="checkbox" id="sepia" name="sepia" on:change={redraw} bind:checked={sepia} />

		<br />

		<label for="name">Name&nbsp;</label>
		<input type="text" id="name" name="name" on:input={redraw} bind:value={name} />

		<br />

		<label for="reward">Reward&nbsp;</label>
		<input type="text" id="reward" name="reward" on:input={redraw} bind:value={reward} />

		<br />

		<label for="extra">Extra text</label>
		<textarea id="extra" name="extra" on:input={redraw} bind:value={extra} />

		<br />

		<label for="printer">Printer Friendly Option</label>
		<input
			type="checkbox"
			id="printer-friendly"
			name="printer-friendly"
			on:change={redraw}
			bind:checked={printerFriendly}
		/>

        <br />

        <button on:click={save}>Save Image</button>
	</form>
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
	}

	#form {
		margin-left: 1rem;
	}

	input,
	textarea {
		margin-bottom: 0.5rem;
	}

	textarea {
		min-width: 300px;
		min-height: 3rem;
	}

	@media only screen and (max-width: 600px) {
		#poster {
			transform: scale(0.75) translate(-15%, -15%);
		}

		#form {
			transform: translateY(-100px);
			margin-left: 0;
		}

		.container {
			flex-direction: column;
		}
	}
</style>
