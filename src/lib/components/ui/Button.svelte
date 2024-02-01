<script lang="ts">
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	let {
		children,
		disabled = false,
		fancy = false,
		classNames = ''
	} = $props<{ children: Snippet; fancy?: boolean; disabled?: boolean; classNames?: string }>();
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
			on:click
			{disabled}
		>
			{@render children()}
		</button>
	</div>
{:else}
	<button
		class={twMerge('rounded border px-4 py-2 transition-all hover:bg-slate-300', classNames)}
		on:click
		{disabled}
	>
		{@render children()}
	</button>
{/if}
