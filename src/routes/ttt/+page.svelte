<script lang="ts">
	import { Application } from "pixi.js";

    let container: any;

    // Create app and add to screen
    const app = new Application();
    container.appendChild(app.view);

</script>

<div bind:this={container}></div>