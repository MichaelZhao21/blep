<div class="container">
	<slot />
</div>

<style>
	.container {
		width: 30rem;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	@media (max-width: 600px) {
		.container {
			width: calc(100% - 2rem);
			padding: 0 1rem;
		}
	}
</style>
