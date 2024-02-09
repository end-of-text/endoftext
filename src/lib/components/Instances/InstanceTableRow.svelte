<script lang="ts">
	import { getMetric, getPrediction, updateInstance } from '$lib/api';
	import type { Tables } from '$lib/supabase';
	import { Trash2 } from 'lucide-svelte';

	let { instance, prompt, selected, project, removeInstance } = $props<{
		instance: Tables<'instances'>;
		prompt: Tables<'prompts'>;
		project: Tables<'projects'>;
		selected: boolean;
		removeInstance: (id: number) => void;
	}>();

	let localInstanceInput = $state(instance.input);
	let localInstanceLabel = $state(instance.label);

	let prediction = $derived(getPrediction(prompt, instance.id, instance.input));
	let metric = $derived(project.show_labels ? getMetric(instance, prediction) : undefined);
</script>

<tr class="border-b align-top text-sm">
	<td class="w-6 p-3 align-top">
		<input bind:checked={selected} type="checkbox" />
	</td>
	<td
		contenteditable="plaintext-only"
		class="box-border p-3"
		bind:innerText={localInstanceInput}
		onblur={() => {
			updateInstance({ ...instance, input: localInstanceInput }).then(() => {
				instance.input = localInstanceInput;
			});
		}}
		onkeydown={(event) => {
			if (event.key === 'Enter' && (event.shiftKey || event.metaKey)) {
				event.currentTarget.blur();
			}
		}}
	/>
	{#if project.show_labels}
		<td
			contenteditable="plaintext-only"
			class="box-border p-3"
			bind:innerText={localInstanceLabel}
			onblur={() => {
				updateInstance({ ...instance, label: localInstanceLabel }).then(() => {
					instance.label = localInstanceLabel;
				});
			}}
			onkeydown={(event) => {
				if (event.key === 'Enter' && (event.shiftKey || event.metaKey)) {
					event.currentTarget.blur();
				}
			}}
		/>
	{/if}
	<td class="p-3">
		{#await prediction}
			Loading...
		{:then pred}
			{pred?.prediction}
		{/await}
	</td>
	{#if project.show_labels}
		<td class="p-3">
			{#await metric}
				Loading...
			{:then metric}
				{#if metric}
					{(Math.round(metric.metric * 100) / 100).toFixed(2)}
				{/if}
			{/await}
		</td>
	{/if}
	<td class="flex justify-end p-3">
		<button onclick={() => removeInstance(instance.id)}>
			<Trash2 class="cursor-pointer transition hover:text-red-600" />
		</button>
	</td>
</tr>
