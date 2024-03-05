<script lang="ts">
	import { applyRewrite } from '$lib/api';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Tables } from '$lib/supabase';
	import { FlaskConical } from 'lucide-svelte';

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

<div
	class="flex w-full flex-col justify-between rounded-br rounded-tr border border-l-4 border-l-blue-600 px-3 py-2 text-left"
	onmouseup={(e) => e.stopPropagation()}
>
	<div class="flex items-center gap-2">
		<FlaskConical class="h-5 w-5 text-blue-600" />
		<h4>Rewrite the selected text</h4>
	</div>
	<p class="mt-1 text-sm text-gray-active">Describe how to rewrite the selected text.</p>
	<textarea
		class="mt-2 w-full resize-none"
		bind:value={userInput}
		onkeydown={(e) => {
			if (e.key === 'Enter' && e.metaKey) {
				e.preventDefault();
				accept();
			}
		}}
	/>
	<div class="flex w-full items-center justify-end pt-2">
		{#if applyingSuggestion}
			<Spinner />
		{:else}
			<Button onclick={accept}>Apply</Button>
		{/if}
	</div>
</div>
