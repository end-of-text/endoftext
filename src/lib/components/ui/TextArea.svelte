<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	let {
		value,
		numRows = 2,
		plain = false,
		placeholder = '',
		classNames = '',
		width = 'w-96',
		label = undefined,
		name = ''
	} = $props<{
		value: string;
		numRows?: number;
		plain?: boolean;
		placeholder?: string;
		classNames?: string;
		width?: string;
		label?: string | undefined;
		name?: string;
	}>();
</script>

<div class={twMerge('flex flex-col items-start justify-center', classNames)}>
	{#if label}
		<p class="text-grey-dark">
			{label}
		</p>
	{/if}
	<textarea
		rows={numRows}
		class="block p-2.5 {width} text-sm text-gray-900 bg-white {plain
			? ''
			: 'rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500'} resize-none"
		{placeholder}
		bind:value
		{name}
	/>
</div>
