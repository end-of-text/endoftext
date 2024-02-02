<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<main class="flex h-full w-full bg-background">
	{@render children()}
</main>
