<script lang="ts">
	import { page } from '$app/stores';

	let { children } = $props();
</script>

<svelte:head>
	<title>endoftext | {$page.data.project.name}</title>
</svelte:head>

<div class="flex h-full w-full flex-col items-center justify-center">
	{@render children()}
</div>
