<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { onNavigate } from '$app/navigation';
	import { navigating, page } from '$app/stores';
	import { PUBLIC_AMPLITUDE_API_KEY } from '$env/static/public';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import { tooltipState } from '$lib/tooltip.svelte';
	import * as amplitude from '@amplitude/analytics-browser';
	import NProgress from 'nprogress';
	import '../app.css';
	import '../nprogress.css';

	let { children } = $props();

	NProgress.configure({
		// Full list: https://github.com/rstacruz/nprogress#configuration
		minimum: 0.16,
		showSpinner: false
	});

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

	$effect(() => {
		if ($navigating) NProgress.start();
		else NProgress.done();
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

<main class="flex h-screen w-screen">
	<Tooltip />
	{@render children()}
</main>
