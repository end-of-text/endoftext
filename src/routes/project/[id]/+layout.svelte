<script lang="ts">
	import { page } from '$app/stores';

	let { children } = $props();
</script>

<svelte:head>
	<title>Logogram | {$page.data.project.name}</title>
	<meta name="description" content="AI-assisted Prompt Editor" />
</svelte:head>

<div class="flex h-full min-h-0 w-full grow flex-col items-center justify-center">
	{@render children()}
</div>
