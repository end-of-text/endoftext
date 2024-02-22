<script lang="ts">
	import { getPrediction, updateInstance } from '$lib/api';
	import autosize from '$lib/autosize';
	import { getMetric } from '$lib/metrics';
	import type { Tables } from '$lib/supabase';
	import { tooltip } from '$lib/tooltip.svelte';
	import { ArrowRight, Trash2 } from 'lucide-svelte';

	let { instance, prompt, metricValues, selected, project, removeInstance } = $props<{
		instance: Tables<'instances'>;
		prompt: Tables<'prompts'>;
		project: Tables<'projects'>;
		metricValues: Record<string, Promise<number | undefined>>;
		selected: boolean;
		removeInstance: (id: number) => void;
	}>();

	let localInstanceInput = $state(instance.input);
	let localInstanceLabel = $state(instance.label);
	let rowHovered = $state(false);
	let inputArea: HTMLTextAreaElement | undefined = $state(undefined);
	let labelArea: HTMLTextAreaElement | undefined = $state(undefined);
	let predictionArea: HTMLTextAreaElement | undefined = $state(undefined);
	let prediction: Promise<Tables<'predictions'> | undefined> = $state(
		new Promise((resolve) => resolve(undefined))
	);
	let metric: Promise<number | undefined> = $state(new Promise((resolve) => resolve(undefined)));

	$effect(() => {
		updateMetric(metric);
	});

	$effect(() => {
		prediction = getPrediction(prompt, instance.id, localInstanceInput);
	});

	$effect(() => {
		metric = getMetric(prompt, localInstanceLabel, prediction, project.metric_name);
	});

	function updateMetric(metric: Promise<number | undefined>) {
		metricValues[instance.id] = metric;
	}
</script>

<tr
	class="group border-b align-top text-sm"
	onmouseenter={() => (rowHovered = true)}
	onmouseleave={() => (rowHovered = false)}
>
	<td
		class=": py-3 pl-3 align-top transition-all {rowHovered || selected
			? 'opacity-100'
			: 'opacity-20'}"
	>
		<input bind:checked={selected} type="checkbox" />
	</td>
	<td class="h-full p-2">
		<textarea
			bind:this={inputArea}
			use:autosize
			class="box-border w-full border-none"
			value={localInstanceInput}
			onblur={() => {
				localInstanceInput = inputArea?.value ?? '';
				updateInstance({ ...instance, input: localInstanceInput, label: localInstanceLabel });
				prediction = getPrediction(prompt, instance.id, localInstanceInput, true);
				inputArea && autosize(inputArea);
				labelArea && autosize(labelArea);
				predictionArea && autosize(predictionArea);
			}}
			onkeydown={(event) => {
				if (event.key === 'Enter' && (event.shiftKey || event.metaKey)) {
					event.currentTarget.blur();
				}
			}}
		/>
	</td>
	<td class="h-full p-2">
		{#await prediction}
			Loading...
		{:then pred}
			<textarea
				bind:this={predictionArea}
				use:autosize
				class="box-border w-full border-none"
				value={pred?.prediction}
				disabled
			/>
		{/await}
	</td>
	{#if project.show_labels}
		<td class="relative h-full p-2">
			<textarea
				bind:this={labelArea}
				use:autosize
				class="box-border w-full border-none"
				value={localInstanceLabel}
				onblur={() => {
					localInstanceLabel = labelArea?.value ?? '';
					updateInstance({ ...instance, input: localInstanceInput, label: localInstanceLabel });
					inputArea && autosize(inputArea);
					labelArea && autosize(labelArea);
					predictionArea && autosize(predictionArea);
				}}
				onkeydown={(event) => {
					if (event.key === 'Enter' && (event.shiftKey || event.metaKey)) {
						event.currentTarget.blur();
					}
				}}
			/>
			<button
				class="absolute -left-8 top-3 hidden rounded bg-white p-1 text-gray-500 opacity-20 transition hover:opacity-100 group-hover:flex"
				onclick={() =>
					prediction.then((p) => {
						localInstanceLabel = p?.prediction || '';
						updateInstance({ ...instance, label: localInstanceLabel });
						inputArea && autosize(inputArea);
						labelArea && autosize(labelArea);
						predictionArea && autosize(predictionArea);
					})}
				use:tooltip={{ text: 'Use prediction as instance label' }}
			>
				<ArrowRight class="h-4" />
			</button>
		</td>
		{#if project.metric_name !== null}
			<td class="p-3">
				{#if instance.label}
					{#await metric}
						Loading...
					{:then metric}
						{#if metric}
							{(Math.round(metric * 100) / 100).toFixed(2)}
						{/if}
					{/await}
				{/if}
			</td>
		{/if}
	{/if}
	<td class="flex justify-end p-3">
		<button onclick={() => removeInstance(instance.id)}>
			<Trash2 class="h-5 w-5 cursor-pointer transition-all hover:text-red-600" />
		</button>
	</td>
</tr>
