<script lang="ts">
	import { getMetric, getPrediction, updateInstance } from '$lib/api';
	import type { Tables } from '$lib/supabase';
	import { Trash2 } from 'lucide-svelte';

	let { instance, prompt, metricValues, selected, project, removeInstance } = $props<{
		instance: Tables<'instances'>;
		prompt: Tables<'prompts'>;
		project: Tables<'projects'>;
		metricValues: Record<string, Promise<Tables<'metrics'> | undefined>>;
		selected: boolean;
		removeInstance: (id: number) => void;
	}>();

	let localInstanceInput = $state(instance.input);
	let localInstanceLabel = $state(instance.label);
	let rowHovered = $state(false);

	let prediction = $derived(getPrediction(prompt, instance.id, instance.input));
	let metric = $derived(getMetric(prompt, instance, prediction));

	$effect(() => {
		updateMetric(metric);
	});

	function updateMetric(metric: Promise<Tables<'metrics'> | undefined>) {
		metricValues[instance.id] = metric;
	}
</script>

<tr
	class="border-b align-top text-sm"
	onmouseenter={() => {
		rowHovered = true;
	}}
	onmouseleave={() => {
		rowHovered = false;
	}}
>
	<td
		class="py-3 pl-3 align-top transition-all {rowHovered || selected
			? 'opacity-100'
			: 'opacity-20'}"
	>
		<input bind:checked={selected} type="checkbox" />
	</td>
	<td
		contenteditable="plaintext-only"
		class="box-border p-3"
		bind:innerText={localInstanceInput}
		onblur={() => {
			updateInstance({ ...instance, input: localInstanceInput }).then(() => {
				instance = { ...instance, input: localInstanceInput };
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
					instance = { ...instance, label: localInstanceLabel };
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
	{#if project.show_labels && instance.label}
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
			<Trash2 class="h-5 w-5 cursor-pointer transition-all hover:text-red-600" />
		</button>
	</td>
</tr>
