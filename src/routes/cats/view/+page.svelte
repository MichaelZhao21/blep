<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Dropzone from '../rank/Dropzone.svelte';

	const projects = Array.from(Array(103).keys()).map((i) => ({
		id: i,
		score: 0,
	}));
</script>

<Container>
	<h1>Here's all da cats :3</h1>
	<Dropzone items={projects} />
</Container>
