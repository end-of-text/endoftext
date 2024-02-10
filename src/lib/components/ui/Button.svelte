<script lang="ts">
	import { tooltip } from '$lib/tooltip.svelte';
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	let {
		children,
		title = '',
		onclick = () => {},
		disabled = false,
		classNames = '',
		tooltipText = ''
	} = $props<{
		children: Snippet;
		title?: string;
		onclick?: MouseEventHandler<HTMLButtonElement>;
		disabled?: boolean;
		classNames?: string;
		tooltipText?: string;
	}>();
</script>

<button
	class={twMerge(
		'flex gap-2 rounded border px-3 py-1.5 transition-all hover:shadow disabled:bg-gray-50 disabled:text-gray-500 disabled:hover:shadow-none',
		classNames
	)}
	{disabled}
	{onclick}
	use:tooltip={{ text: tooltipText }}
>
	{@render children()}
	{#if title}
		<span class="text-black">{title}</span>
	{/if}
</button>
