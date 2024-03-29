<script lang="ts">
	import { page } from '$app/stores';
	import {
		createInstance,
		deleteInstance,
		deleteInstances,
		generateInstances,
		getPrediction,
		toggleProjectLabels,
		updateInstances
	} from '$lib/api';
	import Confirm from '$lib/components/popups/Confirm.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Tables } from '$lib/supabase';
	import { ChevronDown, ChevronUp, PlusCircle, Tag, Trash2 } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import PaywallPopup from '../popups/PaywallPopup.svelte';
	import GenerateInstances from './GenerateInstances.svelte';
	import InstanceTableRow from './InstanceTableRow.svelte';

	let { instances, prompt, project, predictions } = $props<{
		instances: Tables<'instances'>[];
		prompt: Tables<'prompts'>;
		project: Tables<'projects'>;
		predictions: Record<string, Promise<string | null>>;
	}>();

	let selectedInstances = $state<boolean[]>([]);
	let generatingInstances = $state(false);
	let showPaywall = $state(false);
	let showDelete = $state(false);
	let metrics = $state<Record<string, number | undefined>>({});
	let sort = $state<{ column: string; ascending: boolean } | undefined>(undefined);

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
				return newInstance;
			})
		);
		updateInstances(instances);
	}

	function updateSort(headerName: string) {
		if (sort?.column === headerName) {
			if (!sort.ascending) {
				sort = undefined;
			} else {
				sort = { ...sort, ascending: false };
			}
		} else {
			sort = { column: headerName, ascending: true };
		}
	}

	function sortedInstances(
		instances: Tables<'instances'>[],
		sort: { column: string; ascending: boolean } | undefined
	) {
		if (sort === undefined) return instances;
		if (sort.column === 'metric') {
			const extreme = sort.ascending ? -Infinity : Infinity;

			const sorted = instances.toSorted((a, b) => {
				const metricA = metrics[a.id];
				const safeMetricA = metricA === undefined ? extreme : metricA;
				const metricB = metrics[b.id];
				const safeMetricB = metricB === undefined ? extreme : metricB;

				if (safeMetricA === safeMetricB) return 0;
				if (sort.ascending) return safeMetricA > safeMetricB ? 1 : -1;
				return safeMetricA < safeMetricB ? 1 : -1;
			});
			return sorted;
		}
		return instances;
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
							<th
								class="flex w-32 cursor-pointer items-center whitespace-nowrap px-2 py-2"
								onclick={() => updateSort('metric')}
							>
								<span>{project.metric_name}</span>
								{#if avgMetric !== undefined}
									<span class="ml-2 text-sm font-normal text-gray-active"
										>({avgMetric.toFixed(2)})</span
									>
								{/if}
								{#if sort}
									{#if sort.column === 'metric' && sort.ascending}
										<ChevronUp class="h-4 w-4 shrink-0" />
									{:else if sort.column === 'metric' && !sort.ascending}
										<ChevronDown class="h-4 w-4 shrink-0" />
									{/if}
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
				{#each sortedInstances(instances, sort) as instance, i (instance.id)}
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
