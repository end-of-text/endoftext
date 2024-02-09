<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>endoftext</title>
	<meta name="description" content="AI-assisted Prompt Editor" />
</svelte:head>

<main class="flex h-screen w-screen">{@render children()}</main>
