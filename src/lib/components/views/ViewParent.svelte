<script lang="ts">
	import { X } from 'lucide-svelte';
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
		onclose: MouseEventHandler<HTMLElement>;
		classNames?: string;
	}>();
</script>

<div
	class="absolute inset-0 z-30 flex cursor-default items-baseline justify-center bg-gray-200 bg-opacity-60 p-12 text-left"
	transition:fade={{ duration: 200 }}
	onmousedown={onclose}
	onkeydown={() => undefined}
	role="button"
	tabindex="0"
>
	<button
		class={twMerge('flex h-full w-full cursor-default rounded border bg-white p-3', classNames)}
		onmousedown={(e) => e.stopPropagation()}
	>
		{@render children()}
	</button>
	<button class="absolute right-14 top-14 rounded bg-white" onclick={onclose}>
		<X class="text-gray-inactive transition-all hover:text-gray-hovered" />
	</button>
</div>
