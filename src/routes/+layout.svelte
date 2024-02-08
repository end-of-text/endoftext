<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<main class="flex h-screen w-screen">{@render children()}</main>
