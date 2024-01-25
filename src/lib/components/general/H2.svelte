<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, classNames = '' } = $props<{ children: Snippet; classNames?: string }>();
</script>

<h2 class="font-black text-xl my-10 {classNames}">
	{@render children()}
</h2>
