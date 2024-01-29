<script lang="ts">
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	let { children, classNames = '' } = $props<{ children: Snippet; classNames?: string }>();
</script>

<h2 class={twMerge('font-black text-xl my-10', classNames)}>
	{@render children()}
</h2>
