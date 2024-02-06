<script lang="ts">
	import { acceptSuggestion } from '$lib/api';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Tables } from '$lib/supabase';
	import { EditorType, RequiredInputType } from '$lib/types';
	import { Lightbulb, ShieldPlus, ShieldX } from 'lucide-svelte';

	const borderMap: { [key: string]: string } = {
		ERROR: 'border-l-red-600',
		ENHANCEMENT: 'border-l-green-600',
		OPTIMIZATION: 'border-l-blue-600'
	};

	let { suggestion, prompt, editPrompt } = $props<{
		suggestion: Tables<'suggestions'>;
		prompt: Tables<'prompts'>;
		editPrompt: (suggestion: string) => void;
	}>();

	let applyingSuggestion = $state(false);
	let userInput = $state<string | undefined>(undefined);

	async function accept() {
		applyingSuggestion = true;
		editPrompt(await acceptSuggestion(suggestion, prompt, userInput));
		applyingSuggestion = false;
	}
</script>

<div
	class="flex items-start justify-between rounded border border-l-4 p-2 {borderMap[
		suggestion.type
	]}"
>
	<div class="mr-4 flex flex-col">
		<div class="mb-2 flex items-center gap-2">
			{#if suggestion.type === EditorType.ERROR}
				<ShieldX class="text-red-600" />
			{:else if suggestion.type === EditorType.ENHANCEMENT}
				<Lightbulb class="text-green-600" />
			{:else if suggestion.type === EditorType.OPTIMIZATION}
				<ShieldPlus class="text-blue-600" />
			{/if}
			<p class="font-bold">
				{suggestion.name}
			</p>
		</div>
		<p>
			{suggestion.description}
		</p>
		{#if suggestion.required_input_type}
			{#if suggestion.required_input_type === RequiredInputType.TEXT}
				<textarea class="w-full" bind:value={userInput} />
			{/if}
		{/if}
	</div>
	<div class="flex min-w-20 items-center justify-center">
		{#if applyingSuggestion}
			<Spinner />
		{:else}
			<Button onclick={accept}>Apply</Button>
		{/if}
	</div>
</div>
