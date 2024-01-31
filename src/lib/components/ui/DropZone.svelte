<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher, type Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	let { children, classNames = '' } = $props<{ children: Snippet; classNames?: string }>();

	let dragOver = $state(false);

	$effect(() => {
		if (browser) {
			window.addEventListener('dragover', () => (dragOver = true));
			window.addEventListener('dragleave', () => (dragOver = false));
			window.addEventListener('drop', (e) => {
				e.preventDefault();
				dragOver = false;
			});
		}
	});

	const dispatch = createEventDispatcher<{
		drop: DragEvent;
	}>();

	async function dropFunction(event: DragEvent) {
		dispatch('drop', event);
	}
</script>

<div class={twMerge('group relative h-32 w-96 rounded', classNames)}>
	<div
		class="absolute -inset-0.5 rounded-lg {dragOver
			? 'bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 group-hover:opacity-100'
			: 'bg-gray-500'}  w-100 opacity-75 blur transition duration-500"
	></div>
	{#if dragOver}
		<div
			tabindex="0"
			ondragover={(e) => {
				e.preventDefault();
			}}
			ondrop={dropFunction}
			class="relative flex h-full w-full items-center justify-center rounded bg-white"
			role="button"
		>
			HERE!
		</div>
	{:else}
		<div class="relative flex h-full w-full items-center justify-center rounded bg-white p-4">
			{@render children()}
		</div>
	{/if}
</div>
