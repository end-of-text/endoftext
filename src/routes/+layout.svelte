<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import { tooltipState } from '$lib/tooltip.svelte';
	import '../app.css';

	let { children } = $props();

	onNavigate(() => {
		tooltipState.set({
			hover: false,
			mousePos: { x: 0, y: 0 },
			text: undefined
		});
	});
</script>

<svelte:head>
	<title>endoftext</title>
	<meta name="description" content="AI-assisted Prompt Editor" />
</svelte:head>

<main class="flex h-screen w-screen">
	<Tooltip />
	{@render children()}
</main>
