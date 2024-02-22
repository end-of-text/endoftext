<script lang="ts">
	import { acceptSuggestion } from '$lib/api';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Tables } from '$lib/supabase';
	import { EditorType, RequiredInputType } from '$lib/types';
	import { Check, Coins, Lightbulb, ShieldX, X } from 'lucide-svelte';

	let {
		suggestion,
		prompt,
		editPrompt,
		dismissSuggestion,
		applied = false,
		disabled = false
	} = $props<{
		suggestion: Tables<'suggestions'>;
		prompt: Tables<'prompts'>;
		editPrompt: (newPrompt: Tables<'prompts'>, suggestionId: number) => void;
		dismissSuggestion: (suggestionId: number) => void;
		applied?: boolean;
		disabled?: boolean;
	}>();

	let applyingSuggestion = $state(false);
	let userInput = $state<string | undefined>(undefined);

	const borderMap: { [key: string]: string } = {
		ERROR: 'border-l-red-600',
		ENHANCEMENT: 'border-l-green-600',
		OPTIMIZATION: 'border-l-yellow-400'
	};

	async function accept() {
		applyingSuggestion = true;
		const changedPrompt = await acceptSuggestion(suggestion, prompt, userInput);
		editPrompt(changedPrompt, suggestion.id);
		applyingSuggestion = false;
	}
</script>

<div
	class="flex justify-between rounded-br rounded-tr border border-l-4 p-3 text-left {disabled
		? 'border-l-gray-600'
		: borderMap[suggestion.type]}"
>
	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			{#if suggestion.type === EditorType.ERROR}
				<ShieldX class="h-5 w-5 {disabled ? 'text-gray-600' : 'text-red-600'}" />
			{:else if suggestion.type === EditorType.ENHANCEMENT}
				<Lightbulb class="h-5 w-5 {disabled ? 'text-gray-600' : 'text-green-600'}" />
			{:else if suggestion.type === EditorType.OPTIMIZATION}
				<Coins class="h-5 w-5 {disabled ? 'text-gray-600' : 'text-yellow-400'}" />
			{/if}
			<p class="font-semibold">
				{suggestion.name}
			</p>
		</div>
		<p class="my-1 text-gray-600">
			{suggestion.description}
		</p>
		{#if suggestion.required_input_type}
			{#if suggestion.required_input_type === RequiredInputType.TEXT}
				<textarea class="mt-2 w-full" bind:value={userInput} />
			{/if}
		{/if}
	</div>
	<div class="flex h-full flex-col items-end justify-between">
		<button
			class="cursor-pointer text-gray-500 opacity-30 transition hover:text-gray-900 hover:opacity-100"
			onclick={() => dismissSuggestion(suggestion.id)}
		>
			<X class="h-4 w-4" />
		</button>
		{#if applied}
			<Check class="h-5 w-5 text-green-600" />
		{:else if applyingSuggestion}
			<Spinner />
		{:else}
			<Button {disabled} onclick={accept}>Apply</Button>
		{/if}
	</div>
</div>
