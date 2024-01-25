<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher, type Snippet } from 'svelte';

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

<div class="group relative w-96 h-32 rounded {classNames}">
	<div
		class="absolute -inset-0.5 rounded-lg {dragOver
			? 'bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 group-hover:opacity-100'
			: 'bg-gray-500'}  opacity-75 blur transition duration-500 w-100"
	></div>
	{#if dragOver}
		<div
			tabindex="0"
			ondragover={(e) => {
				e.preventDefault();
			}}
			ondrop={dropFunction}
			class="relative rounded bg-white w-full h-full flex items-center justify-center"
			role="button"
		>
			HERE!
		</div>
	{:else}
		<div class="relative rounded bg-white w-full h-full flex items-center justify-center">
			{@render children()}
		</div>
	{/if}
</div>
