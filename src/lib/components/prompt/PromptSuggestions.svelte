<script lang="ts">
	import { acceptSuggestion, getSuggestions } from '$lib/api';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Tables } from '$lib/supabase';
	import { RefreshCw } from 'lucide-svelte';

	let { projectId, prompt, editPrompt } = $props<{
		projectId: string;
		prompt: Tables<'prompts'>;
		editPrompt: (suggestion: string) => void;
	}>();

	let applyingSuggestion = $state(false);
	let instanceUpdated = $state<number | undefined>(undefined);
	let suggestionsRequest = $derived(getSuggestions(prompt, instanceUpdated));

	async function accept(prompt: Tables<'prompts'>, suggestion: Tables<'suggestions'>) {
		applyingSuggestion = true;
		editPrompt(await acceptSuggestion(prompt.prompt, suggestion, projectId));
		applyingSuggestion = false;
	}
</script>

<div class="mt-4 flex flex-col gap-2">
	<div class="flex">
		<h2 class="mb-0">Suggestions</h2>
		<button class="pl-4" onclick={() => (instanceUpdated = Date.now())}>
			<RefreshCw class="cursor-pointer transition hover:text-red-600" />
		</button>
	</div>
	{#await suggestionsRequest}
		<Spinner />
	{:then suggestions}
		{#if suggestions === undefined || suggestions.length === 0}
			No suggestions
		{:else}
			{#each suggestions as suggestion}
				<div class="flex items-start justify-between rounded border p-2">
					<div class="mr-4 flex flex-col">
						<p class="font-bold">
							{suggestion.name}
						</p>
						<p>
							{suggestion.description}
						</p>
					</div>
				</div>
			{/each}
		{/if}
	{/await}
</div>
