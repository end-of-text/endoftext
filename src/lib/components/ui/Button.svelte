<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	let {
		children,
		onclick = () => {},
		disabled = false,
		fancy = false,
		classNames = ''
	} = $props<{
		children: Snippet;
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
				: 'bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 group-hover:opacity-100'} opacity-75 blur transition duration-500"
		></div>
		<button
			class="animate relative rounded-lg bg-white px-4 py-2 hover:bg-slate-50 disabled:text-gray-500"
			{onclick}
			{disabled}
		>
			{@render children()}
		</button>
	</div>
{:else}
	<button
		class={twMerge(
			'flex gap-2 rounded border px-3 py-1.5 transition-all hover:bg-slate-100',
			classNames
		)}
		{disabled}
		{onclick}
	>
		{@render children()}
	</button>
{/if}
