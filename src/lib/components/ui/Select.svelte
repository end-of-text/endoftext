<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	let {
		value,
		options,
		classNames = '',
		onchange
	} = $props<{
		value: unknown;
		options: { value: unknown; label: string | number }[];
		classNames?: string;
		onchange: ChangeEventHandler<HTMLSelectElement>;
	}>();
</script>

<div class={twMerge('relative', classNames)}>
	<select
		class="border-grey-light w-full appearance-none rounded border px-2 py-1.5 pe-8 outline-none transition ease-in-out"
		bind:value
		{onchange}
	>
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
	<span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
		<svg class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
			<path
				fill-rule="evenodd"
				d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
				clip-rule="evenodd"
			/>
		</svg>
	</span>
</div>
