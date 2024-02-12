<script lang="ts">
	import { page } from '$app/stores';
	import { createInstance, deleteInstance, deleteInstances, generateInstances } from '$lib/api';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Tables } from '$lib/supabase';
	import { PlusCircle, Sparkle, Sparkles, Trash2 } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import InstanceTableRow from './InstanceTableRow.svelte';

	let { instances, prompt, project } = $props<{
		instances: Tables<'instances'>[];
		prompt: Tables<'prompts'>;
		project: Tables<'projects'>;
	}>();

	let selectedInstances = $state<boolean[]>([]);
	let generatingInstances = $state(false);

	function removeInstance(id: number) {
		instances.splice(
			instances.findIndex((i) => i.id === id),
			1
		);
		deleteInstance(id);
	}
</script>

<div class="flex items-center justify-between">
	<h1>Data</h1>
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
				<Button
					classNames="text-red-600"
					onclick={() =>
						deleteInstances(
							selectedInstances.map((d, i) => (d ? instances[i].id : -1)).filter((d) => d !== -1)
						).then(() => {
							instances = instances.filter((_, i) => !selectedInstances[i]);
							selectedInstances = [];
						})}
				>
					<Trash2 class="h-5 w-5" />
				</Button>
				<Button
					classNames="text-yellow-400"
					title="Generate Similar"
					onclick={() => {
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
					<th class="w-1/3 px-2 py-2 font-semibold">Label</th>
					<th class="w-1/3 px-2 py-2 font-semibold">Prediction</th>
					<th class="whitespace-nowrap px-2 py-2">chrf</th>
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
					bind:instance
					bind:selected={selectedInstances[i]}
					{prompt}
					{project}
					{removeInstance}
				/>
			{/each}
		</tbody>
	</table>
</div>
