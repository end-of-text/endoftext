<script lang="ts">
	import Header from '$lib/components/ui/Header.svelte';
	import '../app.css';

	let { data, children } = $props();

	let session = $derived(data.session);
</script>

<main class="flex h-screen w-screen flex-col">
	<Header {session} />
	<div class="flex min-h-0 w-full grow flex-col items-center justify-center">
		{@render children()}
	</div>
</main>
