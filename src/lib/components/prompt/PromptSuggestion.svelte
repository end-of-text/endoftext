<script lang="ts">
	import { acceptSuggestion } from '$lib/api';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Tables } from '$lib/supabase';
	import { EditorType, RequiredInputType } from '$lib/types';
	import { Coins, Lightbulb, ShieldX } from 'lucide-svelte';

	const borderMap: { [key: string]: string } = {
		ERROR: 'border-l-red-600',
		ENHANCEMENT: 'border-l-green-600',
		OPTIMIZATION: 'border-l-yellow-400'
	};

	let { suggestion, prompt, editPrompt } = $props<{
		suggestion: Tables<'suggestions'>;
		prompt: Tables<'prompts'>;
		editPrompt: (newPrompt: Tables<'prompts'>) => void;
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
	class="flex items-start justify-between rounded-br rounded-tr border border-l-4 p-3 text-left {borderMap[
		suggestion.type
	]}"
>
	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			{#if suggestion.type === EditorType.ERROR}
				<ShieldX class="h-5 w-5 text-red-600" />
			{:else if suggestion.type === EditorType.ENHANCEMENT}
				<Lightbulb class="h-5 w-5 text-green-600" />
			{:else if suggestion.type === EditorType.OPTIMIZATION}
				<Coins class="h-5 w-5 text-yellow-400" />
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
	<div class="flex items-center justify-center">
		{#if applyingSuggestion}
			<Spinner />
		{:else}
			<Button onclick={accept}>Apply</Button>
		{/if}
	</div>
</div>
