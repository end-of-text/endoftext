<script lang="ts">
	import { getPrediction, updateInstance } from '$lib/api';
	import autosize from '$lib/autosize';
	import { getMetric } from '$lib/metrics';
	import type { Tables } from '$lib/supabase';
	import { tooltip } from '$lib/tooltip.svelte';
	import { ArrowRight, Trash2 } from 'lucide-svelte';
	import { untrack } from 'svelte';

	let { instance, prompt, project, metric, selected, removeInstance, prediction } = $props<{
		instance: Tables<'instances'>;
		prompt: Tables<'prompts'>;
		project: Tables<'projects'>;
		metric: number | undefined;
		selected: boolean;
		removeInstance: (id: number) => void;
		prediction: Promise<string | null> | null;
	}>();

	let localInstanceInput = $state(instance.input);
	let localInstanceLabel = $state(instance.label);
	let rowHovered = $state(false);
	let inputArea: HTMLTextAreaElement | undefined = $state(undefined);
	let labelArea: HTMLTextAreaElement | undefined = $state(undefined);
	let predictionArea: HTMLTextAreaElement | undefined = $state(undefined);

	function updateLabel(pred: string | null) {
		updateInstance({ ...instance, input: localInstanceInput, label: localInstanceLabel });
		metric = getMetric(prompt, localInstanceLabel || '', pred || '', project.metric_name);
	}

	$effect(() => {
		prediction?.then((pred) => {
			if (labelArea && predictionArea && labelArea.clientHeight < predictionArea.clientHeight)
				labelArea.style.height = predictionArea.style.height;
			metric = getMetric(prompt, localInstanceLabel || '', pred || '', project.metric_name);
		});
	});

	// Focus input when adding empty instance
	$effect(() => {
		if (localInstanceInput.length === 0) {
			inputArea?.focus();
		}
	});

	// Update label if instance label changes from outside
	$effect(() => {
		localInstanceLabel = instance.label;
		untrack(() => {
			if (labelArea && predictionArea && labelArea.clientHeight < predictionArea.clientHeight)
				labelArea.style.height = predictionArea.style.height;
			prediction?.then((pred) => {
				metric = getMetric(prompt, localInstanceLabel || '', pred || '', project.metric_name);
			});
		});
	});
</script>

<tr
	class="group border-b align-top text-sm"
	onmouseenter={() => (rowHovered = true)}
	onmouseleave={() => (rowHovered = false)}
>
	<td
		class="py-3 pl-3 align-top transition-all {rowHovered || selected
			? 'opacity-100'
			: 'opacity-30'}"
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
				if (localInstanceInput === inputArea?.value) return;
				localInstanceInput = inputArea?.value ?? '';
				updateInstance({ ...instance, input: localInstanceInput, label: localInstanceLabel });
				prediction = getPrediction(prompt, { ...instance, input: localInstanceInput }, true);
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
			{#if pred !== undefined}
				<textarea
					bind:this={predictionArea}
					use:autosize
					class="box-border w-full border-none"
					value={pred}
					disabled
				/>
			{/if}
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
					if (localInstanceLabel === labelArea?.value) return;
					localInstanceLabel = labelArea?.value ?? '';
					prediction?.then((p) => updateLabel(p));
				}}
				onkeydown={(event) => {
					if (event.key === 'Enter' && (event.shiftKey || event.metaKey)) {
						event.currentTarget.blur();
					}
				}}
			/>
			<button
				class="absolute -left-8 top-3 hidden rounded border bg-white p-1 text-gray-active transition hover:text-gray-hovered hover:shadow group-hover:flex"
				onclick={() => {
					prediction?.then((pred) => {
						localInstanceLabel = pred || '';
						if (labelArea && predictionArea && labelArea.clientHeight < predictionArea.clientHeight)
							labelArea.style.height = predictionArea.style.height;
						updateLabel(pred);
					});
				}}
				use:tooltip={{ text: 'Use prediction as instance label' }}
			>
				<ArrowRight class="h-4" />
			</button>
		</td>
		{#if project.metric_name !== null}
			<td class="p-3">
				{#if localInstanceLabel && metric !== undefined}
					{(Math.round(metric * 100) / 100).toFixed(2)}
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
