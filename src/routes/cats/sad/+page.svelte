<script lang="ts">
	import { page } from '$app/stores';

	const error = $page.url.searchParams.get('error');
</script>

<div
	style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;"
>
	<h1>There was a problem accessing the cats page :(</h1>
	{#if error}
		<p style="color: red; font-size: 1.25rem;">Error: {error}</p>
	{/if}
</div>
