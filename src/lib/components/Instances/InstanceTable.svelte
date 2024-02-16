<script lang="ts">
	import { page } from '$app/stores';
	import { createInstance, deleteInstance, deleteInstances, generateInstances } from '$lib/api';
	import Confirm from '$lib/components/popups/Confirm.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Tables } from '$lib/supabase';
	import { PlusCircle, Sparkle, Sparkles, Trash2 } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import PaywallPopup from '../popups/PaywallPopup.svelte';
	import InstanceTableRow from './InstanceTableRow.svelte';

	let { instances, prompt, project } = $props<{
		instances: Tables<'instances'>[];
		prompt: Tables<'prompts'>;
		project: Tables<'projects'>;
	}>();

	let selectedInstances = $state<boolean[]>([]);
	let generatingInstances = $state(false);
	let metricValues = $state<Record<string, Promise<Tables<'metrics'> | undefined>>>({});
	let showPaywall = $state(false);
	let showDelete = $state(false);

	async function averageMetric(
		values: Record<string, Promise<Tables<'metrics'> | undefined>>
	): Promise<number | undefined> {
		const result = Promise.all(Object.values(values)).then((d) => {
			const metrics = d.filter((d) => d !== undefined) as Tables<'metrics'>[];
			if (metrics.length === 0) return undefined;
			return metrics.reduce((acc, m) => acc + m.metric, 0) / metrics.length;
		});
		return result;
	}

	function removeInstance(id: number) {
		instances.splice(
			instances.findIndex((i) => i.id === id),
			1
		);
		deleteInstance(id);
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
		<h1>Test Cases</h1>
		<div class="flex items-center gap-2">
			{#if generatingInstances}
				<Spinner />
			{/if}
			{#if selectedInstances.some((d) => d === true)}
				<div class="flex items-center gap-2" transition:fade={{ duration: 300 }}>
					<button
						class="mr-2 text-gray-500 transition-colors hover:text-gray-900"
						onclick={() => (selectedInstances = [])}
					>
						clear
					</button>
					<Button classNames="text-red-600" onclick={() => (showDelete = true)}>
						<Trash2 class="h-5 w-5" />
					</Button>
					<Button
						classNames="text-yellow-400"
						title="Generate Similar"
						onclick={() => {
							if (instances.length >= 25) {
								showPaywall = true;
								return;
							}
							generatingInstances = true;
							generateInstances(
								prompt,
								instances.filter((_, i) => selectedInstances[i]),
								5
							).then((r) => {
								instances = [...instances, ...r];
								selectedInstances = [];
								generatingInstances = false;
							});
						}}
					>
						<Sparkles class="h-5 w-5" />
					</Button>
				</div>
			{/if}
			<Button
				onclick={() => {
					if (instances.length >= 25) {
						showPaywall = true;
						return;
					}
					generatingInstances = true;
					generateInstances(prompt, instances, 5).then((r) => {
						instances = [...instances, ...r];
						generatingInstances = false;
					});
				}}
				title="Generate"
				classNames="text-yellow-400"
			>
				<Sparkle class="h-5 w-5 transition" />
			</Button>
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
						<th class="flex w-32 items-center gap-2 whitespace-nowrap px-2 py-2">
							<span>chrf</span>
							{#await averageMetric(metricValues)}
								<Spinner />
							{:then metric}
								{#if metric !== undefined}
									<span class="text-sm font-normal text-black opacity-40"
										>({metric.toFixed(2)})</span
									>
								{/if}
							{/await}
						</th>
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
				{#each instances as instance, i (instance.id)}
					<InstanceTableRow
						{instance}
						bind:metricValues
						bind:selected={selectedInstances[i]}
						{prompt}
						{project}
						{removeInstance}
					/>
				{/each}
			</tbody>
		</table>
	</div>
</div>
