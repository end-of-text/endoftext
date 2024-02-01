<script lang="ts">
	import { createEventDispatcher, type Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';

	let { children, classNames = '' } = $props<{ children: Snippet; classNames?: string }>();

	const dispatch = createEventDispatcher();
</script>

<div
	class="absolute inset-0 z-[2000] flex items-baseline justify-center bg-gray-200 bg-opacity-60 p-12 text-left"
	transition:fade={{ duration: 200 }}
	on:mousedown={() => dispatch('close')}
	on:keydown={() => undefined}
	role="button"
	tabindex="0"
>
	<button
		class={twMerge('flex flex-col rounded border bg-white pt-3', classNames)}
		on:mousedown={(e) => e.stopPropagation()}
	>
		{@render children()}
	</button>
</div>
