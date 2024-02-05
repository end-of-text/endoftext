<script lang="ts">
	import { acceptSuggestion, getSuggestions } from '$lib/api';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Tables } from '$lib/supabase';
	import { Lightbulb, RefreshCw, ShieldPlus, ShieldX } from 'lucide-svelte';
	import { untrack } from 'svelte';

	const borderMap: { [key: string]: string } = {
		ERROR: 'border-l-red-600',
		ENHANCEMENT: 'border-l-green-600',
		OPTIMIZATION: 'border-l-blue-600'
	};

	let { projectId, prompt, editPrompt } = $props<{
		projectId: string;
		prompt: Tables<'prompts'>;
		editPrompt: (suggestion: string) => void;
	}>();

	let applyingSuggestion = $state(-1);
	let gettingSuggestions = $state(false);
	let suggestionsRequest: Tables<'suggestions'>[] | undefined = $state([]);

	$effect(() => {
		untrack(() => (gettingSuggestions = true));
		getSuggestions(prompt).then((r) => {
			untrack(() => {
				suggestionsRequest = r;
				gettingSuggestions = false;
			});
		});
	});

	async function accept(prompt: Tables<'prompts'>, suggestion: Tables<'suggestions'>) {
		applyingSuggestion = suggestion.id;
		editPrompt(await acceptSuggestion(prompt, suggestion, projectId));
		applyingSuggestion = -1;
	}
</script>

<div class="mt-4 flex flex-col gap-2">
	<div class="my-2 flex">
		<h2 class="mb-0">Suggestions</h2>
		<button
			class="pl-4"
			onclick={() => {
				gettingSuggestions = true;
				getSuggestions(prompt, Date.now()).then((r) => {
					suggestionsRequest = r;
					gettingSuggestions = false;
				});
			}}
		>
			{#if gettingSuggestions}
				<Spinner />
			{:else}
				<RefreshCw class="cursor-pointer transition hover:text-green-600" />
			{/if}
		</button>
	</div>
	{#await suggestionsRequest}
		<Spinner />
	{:then suggestions}
		{#if suggestions === undefined || suggestions.length === 0}
			No suggestions
		{:else}
			{#each suggestions as suggestion (suggestion.id)}
				<div
					class="flex items-center justify-between rounded border border-l-4 p-2 {borderMap[
						suggestion.type
					]}"
				>
					<div class="mr-4 flex flex-col">
						<div class="mb-2 flex items-center gap-2">
							{#if suggestion.type === 'ERROR'}
								<ShieldX class="text-red-600" />
							{:else if suggestion.type === 'ENHANCEMENT'}
								<Lightbulb class="text-green-600" />
							{:else if suggestion.type === 'OPTIMIZATION'}
								<ShieldPlus class="text-blue-600" />
							{/if}
							<p class="font-bold">
								{suggestion.name}
							</p>
						</div>
						<p>
							{suggestion.description}
						</p>
					</div>
					<div class="flex min-w-20 items-center justify-center">
						{#if applyingSuggestion === suggestion.id}
							<Spinner />
						{:else}
							<Button onclick={() => accept(prompt, suggestion)}>Apply</Button>
						{/if}
					</div>
				</div>
			{/each}
		{/if}
	{/await}
</div>
