<script lang="ts">
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	let { children, classNames = '' } = $props<{ children: Snippet; classNames?: string }>();
</script>

<h1
	class={twMerge(
		'bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 text-3xl font-black mb-4',
		classNames
	)}
>
	{@render children()}
</h1>
