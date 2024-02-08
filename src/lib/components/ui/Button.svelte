<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	let {
		children,
		title = '',
		onclick = () => {},
		disabled = false,
		fancy = false,
		classNames = ''
	} = $props<{
		children: Snippet;
		title?: string;
		onclick?: MouseEventHandler<HTMLButtonElement>;
		fancy?: boolean;
		disabled?: boolean;
		classNames?: string;
	}>();
</script>

{#if fancy}
	<div class={twMerge('group relative w-fit', classNames)}>
		<div
			class="absolute -inset-0.5 rounded-lg {disabled
				? 'bg-gray-500'
				: 'bg-rose-400  group-hover:opacity-100'} opacity-50 blur transition duration-500"
		></div>
		<button
			class="animate relative rounded-lg bg-white px-4 py-2 disabled:text-gray-500"
			{onclick}
			{disabled}
		>
			{@render children()}
		</button>
	</div>
{:else}
	<button
		class={twMerge('flex gap-2 rounded border px-3 py-1.5 transition-all hover:shadow', classNames)}
		{disabled}
		{onclick}
	>
		{@render children()}
		{#if title}
			<span class="text-black">{title}</span>
		{/if}
	</button>
{/if}
