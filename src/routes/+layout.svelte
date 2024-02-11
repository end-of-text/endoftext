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
	<title>endoftext | AI-powered prompt editor</title>
	<meta
		name="description"
		content="Take the guesswork out of prompt engineering with prompt suggestions, smart re-writing, and synthetic data generation. endoftext is an AI-powered prompt writing assistant that helps you quickly improve your prompts."
	/>
</svelte:head>

<main class="flex h-screen w-screen">
	<Tooltip />
	{@render children()}
</main>
