<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';

	let { children } = $props<{ children: Snippet }>();
</script>

<div class="h-full w-full flex flex-col">
	{@render children()}
</div>
