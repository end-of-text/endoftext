<script lang="ts">
	import { page } from '$app/stores';
	import {
		createInstance,
		deleteInstance,
		deleteInstances,
		generateInstances,
		getPrediction,
		toggleProjectLabels,
		updateInstance
	} from '$lib/api';
	import Confirm from '$lib/components/popups/Confirm.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Tables } from '$lib/supabase';
	import { PlusCircle, Tag, Trash2 } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import PaywallPopup from '../popups/PaywallPopup.svelte';
	import GenerateInstances from './GenerateInstances.svelte';
	import InstanceTableRow from './InstanceTableRow.svelte';

	let { instances, prompt, project, predictions } = $props<{
		instances: Tables<'instances'>[];
		prompt: Tables<'prompts'>;
		project: Tables<'projects'>;
		predictions: { [key: string]: Promise<string | null> };
	}>();

	let selectedInstances = $state<boolean[]>([]);
	let generatingInstances = $state(false);
	let showPaywall = $state(false);
	let showDelete = $state(false);
	let metrics = $state<Record<string, number | undefined>>({});

	let metricValues = $derived(
		Object.values(metrics).filter((metric) => metric !== undefined) as number[]
	);
	let avgMetric = $derived(
		metricValues.length === 0
			? undefined
			: metricValues.reduce((a, b) => a + b, 0) / metricValues.length
	);

	function createInstances(instruction: string, count: number, generateSimilar: boolean) {
		generatingInstances = true;

		let passedInstances = instances;
		if (generateSimilar) {
			passedInstances = selectedInstances
				.map((d, i) => (d ? instances[i] : null))
				.filter((d) => d !== null) as Tables<'instances'>[];
		}

		generateInstances(prompt, passedInstances, count, instruction).then((newInstances) => {
			const localPreds = { ...predictions };
			newInstances.forEach((inst) => (localPreds[inst.id] = getPrediction(prompt, inst, true)));
			predictions = localPreds;
			instances = [...instances, ...newInstances];
			generatingInstances = false;
		});
	}

	function removeInstance(id: number) {
		instances.splice(
			instances.findIndex((i) => i.id === id),
			1
		);
		deleteInstance(id);
	}

	async function showLabels() {
		// set project labels to true
		project.show_labels = true;
		const projectRes = await toggleProjectLabels(
			project.id,
			prompt,
			project.show_labels,
			project.metric_name
		);
		project.metric_name = projectRes.metric_name;
		// update instances with labels = predictions
		instances = await Promise.all(
			instances.map(async (instance) => {
				const prediction = await predictions[instance.id];
				if (prediction === null || instance.label !== null) return instance;
				const newInstance = { ...instance, label: prediction };
				await updateInstance(newInstance);
				console.log(newInstance);
				return newInstance;
			})
		);
	}
</script>

{#if showDelete}
	<Confirm
		message={'Are you sure you want to delete these instances?'}
		confirmText="Delete"
		cancelText="Cancel"
		confirm={() => {
			showDelete = false;
			deleteInstances(
				selectedInstances.map((d, i) => (d ? instances[i].id : -1)).filter((d) => d !== -1)
			).then(() => {
				instances = instances.filter((_, i) => !selectedInstances[i]);
				selectedInstances = [];
			});
		}}
		cancel={() => (showDelete = false)}
		confirmIsDelete
	/>
{/if}
{#if showPaywall}
	<PaywallPopup
		onclose={() => (showPaywall = false)}
		message="You are using 25/25 test cases for this project"
	/>
{/if}
<div class="flex grow flex-col px-6 pt-4">
	<div class="flex justify-between">
		<div class="flex gap-4">
			<h1>Test Cases</h1>
			{#if !project.show_labels}
				<Button classNames="text-blue-600" onclick={showLabels} title="Add label column">
					<Tag class="h-5 w-5 transition-all" />
				</Button>
			{/if}
		</div>
		<div class="flex items-center gap-2">
			{#if generatingInstances}
				<Spinner />
			{/if}
			{#if selectedInstances.some((d) => d === true)}
				<div class="flex items-center gap-2" transition:fade={{ duration: 300 }}>
					<button
						class="mr-2 text-gray-active transition-colors hover:text-gray-hovered"
						onclick={() => (selectedInstances = [])}
					>
						clear
					</button>
					<Button classNames="text-red-600" onclick={() => (showDelete = true)}>
						<Trash2 class="h-5 w-5" />
					</Button>
				</div>
			{/if}
			<GenerateInstances {createInstances} similar={selectedInstances.some((d) => d === true)} />
			<Button
				onclick={() => {
					if (instances.length >= 25) {
						showPaywall = true;
						return;
					}
					createInstance($page.params.id).then((d) => instances.push(d));
				}}
				title="Add"
				classNames="text-green-600"
			>
				<PlusCircle class="h-5 w-5 transition" />
			</Button>
		</div>
	</div>
	<div class="my-4 w-full grow overflow-auto">
		<table class="w-full">
			<thead class="sticky top-0 z-10 bg-gray-50 text-left">
				<tr class="border-b">
					{#if project.show_labels}
						<th class="rounded-tl" />
						<th class="w-1/3 px-2 py-2 font-semibold">Input</th>
						<th class="w-1/3 px-2 py-2 font-semibold">Prediction</th>
						<th class="w-1/3 px-2 py-2 font-semibold">Label</th>
						{#if project.metric_name !== null}
							<th class="flex w-32 items-center gap-2 whitespace-nowrap px-2 py-2">
								<span>{project.metric_name}</span>
								{#if avgMetric !== undefined}
									<span class="text-sm font-normal text-gray-active">({avgMetric.toFixed(2)})</span>
								{/if}
							</th>
						{/if}
						<th class="min-w-12 whitespace-nowrap rounded-tr" />
					{:else}
						<th class="w-6 rounded-tl" />
						<th class="w-1/2 p-3 font-semibold">Input</th>
						<th class="w-1/2 p-3 font-semibold">Prediction</th>
						<th class="min-w-12 whitespace-nowrap rounded-tr" />
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each instances as instance, i}
					<InstanceTableRow
						{instance}
						{prompt}
						{project}
						prediction={predictions[instance.id]}
						bind:metric={metrics[instance.id]}
						bind:selected={selectedInstances[i]}
						{removeInstance}
					/>
				{/each}
			</tbody>
		</table>
	</div>
</div>
