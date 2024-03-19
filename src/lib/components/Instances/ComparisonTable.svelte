<script lang="ts">
	import { goto } from '$app/navigation';
	import { getPredictionsForInstancesAndPrompts, getPrompt } from '$lib/api';
	import type { Tables } from '$lib/supabase';
	import { tooltip } from '$lib/tooltip.svelte';
	import { MoveRight } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import Select from '../ui/Select.svelte';
	import Spinner from '../ui/Spinner.svelte';
	import ComparisonTableRow from './ComparisonTableRow.svelte';

	let { instances, showPrompt, promptIds, allPromptIds, projectId } = $props<{
		instances: Tables<'instances'>[];
		showPrompt: boolean;
		promptIds: number[];
		allPromptIds: number[];
		projectId: string;
	}>();

	let prompts = $derived(
		promptIds.map((id) => {
			return getPrompt(projectId, id);
		})
	);
	let predictions = $derived(getPredictionsForInstancesAndPrompts(prompts, instances));
</script>

<div class="my-4 w-full grow overflow-auto">
	<table class="w-full">
		<thead class="sticky top-0 z-10 bg-gray-50 text-left">
			<tr class="border-b">
				<th class="rounded-tl px-2 py-2 align-top"> </th>
				{#each prompts as prompt, index}
					{#await prompt}
						<th class="w-1/3 px-2 py-2 font-normal">
							<Spinner />
						</th>
					{:then prompt}
						{#if prompt && prompt.id}
							<th class="w-1/3 px-2 py-2 font-normal">
								<div class="flex flex-col gap-2" use:tooltip={{ text: prompt.prompt }}>
									<div class="flex items-center gap-2">
										<Select
											classNames="w-32"
											options={allPromptIds.map((id) => ({ value: id, label: id }))}
											value={prompt.id}
											onchange={(e) => {
												const target = e.target as HTMLSelectElement;
												const newValue = e.target ? parseInt(target.value) : prompt.id;
												promptIds = [...promptIds.slice(0, index), newValue, ...promptIds.slice(index + 1)];
											}}
										/>
										<button
											class="flex items-center gap-1 text-sm text-gray-active transition-all hover:text-gray-hovered"
											onclick={() => goto(`/project/${projectId}/${prompt.id}`)}
										>
											<MoveRight class="h-5 w-5" />
										</button>
									</div>
									{#if showPrompt}
										<textarea
											transition:slide
											class="relative h-64 w-full resize-none border-none bg-white py-2 pl-2 pr-6 text-sm font-normal outline-none"
											value={prompt.prompt}
											readonly
										/>
									{/if}
								</div>
							</th>
						{/if}
					{/await}
				{/each}
			</tr>
		</thead>
		<tbody>
			{#await predictions}
				<tr>
					<td colspan={promptIds.length + 1}>
						<div class="flex w-full justify-center py-4">
							<Spinner />
						</div>
					</td>
				</tr>
			{:then preds}
				{#each instances as instance (instance.id)}
					<ComparisonTableRow {instance} {promptIds} predictions={preds[instance.id]} />
				{/each}
			{/await}
		</tbody>
	</table>
</div>
