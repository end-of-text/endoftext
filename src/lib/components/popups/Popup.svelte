<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import { fade } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';

	let {
		children,
		onclose,
		classNames = ''
	} = $props<{
		children: Snippet;
		onclose: MouseEventHandler<HTMLDivElement>;
		classNames?: string;
	}>();
</script>

<div
	class="absolute inset-0 z-40 flex cursor-default items-baseline justify-center bg-gray-200 bg-opacity-60 p-12 text-left"
	transition:fade={{ duration: 200 }}
	onmousedown={onclose}
	onkeydown={() => undefined}
	role="button"
	tabindex="0"
>
	<button
		class={twMerge('flex cursor-default flex-col rounded border bg-white p-3', classNames)}
		onmousedown={(e) => e.stopPropagation()}
	>
		{@render children()}
	</button>
</div>
