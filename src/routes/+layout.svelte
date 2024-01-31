<script lang="ts">
	import '../app.css';

	let { data, children } = $props();

	let session = $derived(data.session);
</script>

<main class="p-5">
	<div class="w-full flex-row-reverse">
		{#if session}
			<a class="btn" href="/home">home</a>
			<a class="btn" href="/account/preferences">account</a>
		{/if}
	</div>

	<div class="h-full w-full flex flex-col items-center justify-center">
		{@render children()}
	</div>
</main>
