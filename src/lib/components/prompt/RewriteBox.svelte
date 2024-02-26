<script lang="ts">
	import { applyRewrite } from '$lib/api';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Tables } from '$lib/supabase';
	import { fade } from 'svelte/transition';

	let { selectedSpan, prompt, editPrompt } = $props<{
		selectedSpan: { start: number; end: number } | undefined;
		prompt: Tables<'prompts'>;
		editPrompt: (newPrompt: Tables<'prompts'>, suggestionId: number) => void;
	}>();

	let userInput = $state<string>('');
	let applyingSuggestion = $state(false);

	async function accept() {
		applyingSuggestion = true;
		if (selectedSpan)
			editPrompt(
				{
					...prompt,
					prompt: await applyRewrite(
						prompt.prompt.slice(selectedSpan.start, selectedSpan.end),
						prompt,
						userInput
					)
				},
				-2
			);
		selectedSpan = undefined;
	}
</script>

<button
	class="absolute left-full top-0 z-50 w-[400px]"
	transition:fade={{ duration: 200 }}
	onmouseup={(e) => e.stopPropagation()}
>
	<div
		class="ml-2 flex flex-col items-start rounded-br rounded-tr border border-l-4 border-l-blue-500 bg-white p-4 shadow"
	>
		<h3>Rewrite the selected text</h3>
		<textarea
			class="mt-2 w-full resize-none"
			placeholder="describe how to rewrite the selected text"
			bind:value={userInput}
		/>
		<div class="flex w-full items-center justify-end pt-2">
			{#if applyingSuggestion}
				<Spinner />
			{:else}
				<Button onclick={accept}>Apply</Button>
			{/if}
		</div>
	</div>
</button>
