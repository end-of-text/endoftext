<script lang="ts">
	import { page } from '$app/stores';

	const { children } = $props();
</script>

<svelte:head>
	<title>endoftext | {$page.data.project.name}</title>
</svelte:head>

{@render children()}
