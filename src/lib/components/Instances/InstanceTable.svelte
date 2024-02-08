<script lang="ts">
	import { page } from '$app/stores';
	import { createInstance, deleteInstance, generateInstances } from '$lib/api';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Tables } from '$lib/supabase';
	import { PlusCircle, Sparkle, Sparkles } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import InstanceTableRow from './InstanceTableRow.svelte';

	let { instances, prompt } = $props<{
		instances: Tables<'instances'>[];
		prompt: Tables<'prompts'>;
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
			<button
				transition:fade={{ duration: 300 }}
				class="mr-2 text-gray-500 transition-colors hover:text-red-600"
				onclick={() => (selectedInstances = [])}
			>
				clear
			</button>
			<div transition:fade={{ duration: 300 }}>
				<Button
					classNames="text-blue-600"
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
					<Sparkles />
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
			<Sparkle class="transition" />
		</Button>
		<Button
			onclick={() => {
				createInstance($page.params.id).then((d) => instances.push(d));
			}}
			title="Add"
			classNames="text-green-600"
		>
			<PlusCircle class="transition" />
		</Button>
	</div>
</div>
<div class="mt-4 w-full grow overflow-auto">
	<table class="w-full">
		<thead class="sticky top-0 z-10 bg-gray-50 text-left">
			<tr class="border-b">
				<th class="rounded-tl" />
				<th class="w-1/3 px-2 py-2 font-semibold">Input</th>
				<th class="w-1/3 px-2 py-2 font-semibold">Prediction</th>
				<th class="w-1/3 px-2 py-2 font-semibold">Label</th>
				<th class="min-w-16 whitespace-nowrap rounded-tr px-2 py-1"></th>
			</tr>
		</thead>
		<tbody>
			{#each instances as instance, i (instance.id)}
				<InstanceTableRow
					bind:instance
					bind:selected={selectedInstances[i]}
					{prompt}
					{removeInstance}
				/>
			{/each}
		</tbody>
	</table>
</div>
