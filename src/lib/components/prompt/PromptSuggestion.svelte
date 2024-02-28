<script lang="ts">
	import { acceptSuggestion } from '$lib/api';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { dataGenerationOptions } from '$lib/state.svelte';
	import type { Tables } from '$lib/supabase';
	import { EditorType, RequiredInputType } from '$lib/types';
	import { Check, Coins, FlaskConical, Lightbulb, ShieldX } from 'lucide-svelte';

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
		dismissSuggestion: (suggestion: Tables<'suggestions'>) => void;
		applied?: boolean;
		disabled?: boolean;
	}>();

	let applyingSuggestion = $state(false);
	let userInput = $state<string | undefined>(undefined);

	const borderMap: { [key: string]: string } = {
		ERROR: 'border-l-red-600',
		ENHANCEMENT: 'border-l-green-600',
		OPTIMIZATION: 'border-l-yellow-400',
		DATA: 'border-l-blue-600'
	};

	async function accept() {
		applyingSuggestion = true;
		if (suggestion.type === 'DATA') {
			dataGenerationOptions.instruction = suggestion.description
				.split(':')
				.slice(1)
				.join(':')
				.trim();
			dataGenerationOptions.show = true;
			dismissSuggestion(suggestion);
		} else {
			const changedPrompt = await acceptSuggestion(suggestion, prompt, userInput);
			editPrompt(changedPrompt, suggestion.id);
		}
		applyingSuggestion = false;
	}
</script>

<div
	class="flex w-full flex-col justify-between rounded-br rounded-tr border border-l-4 px-3 py-2 text-left {disabled
		? 'border-l-gray-active'
		: borderMap[suggestion.type]}"
>
	<div class="flex flex-col">
		<div class="flex items-center gap-2">
			{#if suggestion.type === EditorType.ERROR}
				<ShieldX class="h-5 w-5 {disabled ? 'text-gray-active' : 'text-red-600'}" />
			{:else if suggestion.type === EditorType.ENHANCEMENT}
				<Lightbulb class="h-5 w-5 {disabled ? 'text-gray-active' : 'text-green-600'}" />
			{:else if suggestion.type === EditorType.OPTIMIZATION}
				<Coins class="h-5 w-5 {disabled ? 'text-gray-active' : 'text-yellow-400'}" />
			{:else if suggestion.type === EditorType.DATA}
				<FlaskConical class="h-5 w-5 {disabled ? 'text-gray-active' : 'text-blue-600'}" />
			{/if}
			<h4>
				{suggestion.name}
			</h4>
		</div>
		<p class="mt-1 text-sm text-gray-active">
			{suggestion.description}
		</p>
		{#if suggestion.required_input_type}
			{#if suggestion.required_input_type === RequiredInputType.TEXT}
				<textarea class="mt-2 w-full" bind:value={userInput} />
			{/if}
		{/if}
	</div>
	<div class="mt-2 flex items-center justify-end gap-3">
		{#if !applied && !applyingSuggestion}
			<button
				class="cursor-pointer text-sm text-gray-active transition {!disabled
					? 'hover:text-gray-hovered'
					: ''}"
				onclick={() => dismissSuggestion(suggestion)}
				{disabled}
			>
				Dismiss
			</button>
		{/if}
		{#if applied}
			<Check class="h-5 w-5 text-green-600" />
		{:else if applyingSuggestion}
			<Spinner />
		{:else}
			<Button classNames="h-8" {disabled} onclick={accept}>Apply</Button>
		{/if}
	</div>
</div>
