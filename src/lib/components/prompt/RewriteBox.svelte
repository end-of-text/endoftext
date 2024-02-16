<script lang="ts">
	import { applyRewrite } from '$lib/api';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Tables } from '$lib/supabase';

	let { selectedText, prompt, editPrompt } = $props<{
		selectedText: string | undefined;
		prompt: Tables<'prompts'>;
		editPrompt: (suggestion: string) => void;
	}>();

	let userInput = $state<string>('');
	let applyingSuggestion = $state(false);

	async function accept() {
		applyingSuggestion = true;
		if (selectedText) editPrompt(await applyRewrite(selectedText, prompt, userInput));
		selectedText = undefined;
	}
</script>

<button class="absolute left-full top-0 z-50 w-[400px]" onmouseup={(e) => e.stopPropagation()}>
	<div
		class="ml-2 flex flex-col items-start rounded-br rounded-tr border border-l-4 border-l-blue-500 bg-white p-4 shadow"
	>
		<h3>Rewrite</h3>
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
