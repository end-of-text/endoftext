<script lang="ts">
	import { acceptSuggestion } from '$lib/api';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Tables } from '$lib/supabase';
	import { EditorType, RequiredInputType } from '$lib/types';
	import { Lightbulb, ShieldPlus, ShieldX } from 'lucide-svelte';

	let { projectId, suggestion, prompt, editPrompt } = $props<{
		projectId: string;
		suggestion: Tables<'suggestions'>;
		prompt: Tables<'prompts'>;
		editPrompt: (suggestion: string) => void;
	}>();

	let applyingSuggestion = $state(-1);
	let input = $state<unknown>(undefined);

	const borderMap: { [key: string]: string } = {
		ERROR: 'border-l-red-600',
		ENHANCEMENT: 'border-l-green-600',
		OPTIMIZATION: 'border-l-blue-600'
	};

	async function accept(prompt: Tables<'prompts'>, suggestion: Tables<'suggestions'>) {
		applyingSuggestion = suggestion.id;
		editPrompt(await acceptSuggestion(prompt, suggestion, projectId, input));
		applyingSuggestion = -1;
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
				<textarea class="w-full" bind:value={input} />
			{/if}
		{/if}
	</div>
	<div class="flex min-w-20 items-center justify-center">
		{#if applyingSuggestion === suggestion.id}
			<Spinner />
		{:else}
			<Button onclick={() => accept(prompt, suggestion)}>Apply</Button>
		{/if}
	</div>
</div>
