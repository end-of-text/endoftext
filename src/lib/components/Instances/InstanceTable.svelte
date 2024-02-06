<script lang="ts">
	import { page } from '$app/stores';
	import { createInstance, deleteInstance, generateInstances } from '$lib/api';
	import Button from '$lib/components/ui/Button.svelte';
	import type { Tables } from '$lib/supabase';
	import { get } from 'svelte/store';
	import Spinner from '../ui/Spinner.svelte';
	import InstanceTableRow from './InstanceTableRow.svelte';

	let { instances, prompt } = $props<{
		instances: Tables<'instances'>[];
		prompt: Tables<'prompts'>;
	}>();

	let generatingInstances = $state(false);

	function removeInstance(id: number) {
		instances.splice(
			instances.findIndex((i) => i.id === id),
			1
		);
		deleteInstance(id);
	}
</script>

<div class="mt-2 w-full grow overflow-auto">
	<table class="w-full">
		<thead class="sticky top-0 z-10 bg-slate-200 text-left">
			<tr class="border-b-2">
				<th class="w-1/3 rounded-tl px-2 py-1">Input</th>
				<th class="w-1/3 px-2 py-1">Prediction</th>
				<th class="w-1/3 px-2 py-1">Label</th>
				<th class="min-w-16 whitespace-nowrap rounded-tr px-2 py-1"></th>
			</tr>
		</thead>
		<tbody>
			{#each instances as instance (instance.id)}
				<InstanceTableRow bind:instance {prompt} {removeInstance} />
			{/each}
		</tbody>
	</table>
	<div class="my-4 flex items-center gap-2 self-end">
		<Button
			onclick={() => {
				createInstance(get(page).params.id).then((d) => instances.push(d));
			}}
		>
			Add Instance
		</Button>
		<Button
			onclick={() => {
				generatingInstances = true;
				generateInstances(prompt, instances, 5).then((r) => {
					instances = [...instances, ...r];
					generatingInstances = false;
				});
			}}
		>
			Generate Instances
		</Button>
		{#if generatingInstances}
			<Spinner />
		{/if}
	</div>
</div>
