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
		<div class="absolute -inset-0.5 rounded-lg opacity-75 blur transition duration-500"></div>
		<button
			class="animate relative rounded-lg border bg-white px-4 py-1 hover:bg-slate-50 disabled:text-gray-500"
			{onclick}
			{disabled}
		>
			{@render children()}
		</button>
	</div>
{:else}
	<button
		class={twMerge('rounded border px-4 py-1 transition-all hover:bg-slate-300', classNames)}
		{disabled}
		{onclick}
	>
		{@render children()}
	</button>
{/if}
