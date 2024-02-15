<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_AMPLITUDE_API_KEY } from '$env/static/public';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import { tooltipState } from '$lib/tooltip.svelte';
	import * as amplitude from '@amplitude/analytics-browser';
	import '../app.css';

	let { children } = $props();

	if (browser && !dev) {
		amplitude.init(PUBLIC_AMPLITUDE_API_KEY, {
			defaultTracking: true
		});
	}

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
	<meta property="og:title" content="endoftext | AI-powered prompt editor" />
	<meta property="og:site_name" content="app.endoftext.app" />
	<meta
		property="og:description"
		content="Take the guesswork out of prompt engineering with prompt suggestions, smart re-writing, and synthetic data generation. endoftext is an AI-powered prompt writing assistant that helps you quickly improve your prompts."
	/>
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/preview.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
</svelte:head>

<main class="h-full w-full">
	<Tooltip />
	{@render children()}
</main>
