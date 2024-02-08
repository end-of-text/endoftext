<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	let {
		children,
		title = '',
		onclick = () => {},
		disabled = false,
		classNames = ''
	} = $props<{
		children: Snippet;
		title?: string;
		onclick?: MouseEventHandler<HTMLButtonElement>;
		disabled?: boolean;
		classNames?: string;
	}>();
</script>

<button
	class={twMerge(
		'flex gap-2 rounded border px-3 py-1.5 transition-all hover:shadow disabled:bg-gray-50 disabled:text-gray-500 disabled:hover:shadow-none',
		classNames
	)}
	{disabled}
	{onclick}
>
	{@render children()}
	{#if title}
		<span class="text-black">{title}</span>
	{/if}
</button>
