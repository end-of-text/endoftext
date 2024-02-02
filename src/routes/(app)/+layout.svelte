<script lang="ts">
	import Header from '$lib/components/ui/Header.svelte';

	let { data, children } = $props();

	let session = $derived(data.session);
</script>

<div class="flex h-full min-h-0 w-full min-w-0">
	<Header {session} />
	<div class="flex w-full grow flex-col items-center justify-center">
		{@render children()}
	</div>
</div>
