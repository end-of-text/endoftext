<script lang="ts">
	import { getProjectPromptIds } from '$lib/api';
	import type { Tables } from '$lib/supabase';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import ComparisonTable from '../Instances/ComparisonTable.svelte';
	import Spinner from '../ui/Spinner.svelte';
	import ViewParent from './ViewParent.svelte';

	let { prompt, instances, onclose } = $props<{
		prompt: Tables<'prompts'>;
		instances: Tables<'instances'>[];
		onclose: () => void;
	}>();

	let showPrompt = $state(false);
	let promptIds = $state([prompt.id!, prompt.parent_prompt_id!]);
</script>

<ViewParent {onclose}>
	<div class="flex h-full grow flex-col px-6 py-4">
		<div class="mb-2 flex items-end justify-between">
			<h1>Compare Prompts</h1>
			<button
				class="flex items-center gap-1 text-gray-active transition-all hover:text-gray-hovered"
				onclick={() => (showPrompt = !showPrompt)}
			>
				{#if showPrompt}
					Hide Prompts
					<ChevronUp class="h-5 w-5" />
				{:else}
					Show Prompts
					<ChevronDown class="h-5 w-5" />
				{/if}
			</button>
		</div>
		{#await getProjectPromptIds(prompt.project_id)}
			<Spinner />
		{:then allPromptIds}
			<ComparisonTable
				{instances}
				{showPrompt}
				bind:promptIds
				{allPromptIds}
				projectId={prompt.project_id}
			/>
		{/await}
	</div>
</ViewParent>
