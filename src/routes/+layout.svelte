<script lang="ts">
	import Header from '$lib/components/ui/Header.svelte';
	import '../app.css';

	let { data, children } = $props();

	let session = $derived(data.session);
</script>

<main class="h-full w-full">
	<Header {session} />
	<div class="flex h-full w-full flex-col items-center justify-center">
		{@render children()}
	</div>
</main>
