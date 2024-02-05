<script lang="ts">
	import { page } from '$app/stores';
	import { createInstance, deleteInstance } from '$lib/api';
	import Button from '$lib/components/ui/Button.svelte';
	import type { Tables } from '$lib/supabase';
	import { get } from 'svelte/store';
	import InstanceTableRow from './InstanceTableRow.svelte';

	let { instances, prompt } = $props<{
		instances: Tables<'instances'>[];
		prompt: Tables<'prompts'>;
	}>();

	function removeInstance(id: number) {
		instances.splice(
			instances.findIndex((i) => i.id === id),
			1
		);
		deleteInstance(id);
	}
</script>

<table class="w-full table-auto">
	<thead class="text-left">
		<tr class="border-b-2">
			<th class="px-2">Input</th>
			<th class="px-2">Prediction</th>
			<th class="px-2"></th>
		</tr>
	</thead>
	<tbody>
		{#each instances as instance (instance.id)}
			<InstanceTableRow bind:instance {prompt} {removeInstance} />
		{/each}
	</tbody>
</table>
<Button
	classNames="mt-4 w-fit"
	onclick={() => {
		createInstance(get(page).params.id).then((d) => instances.push(d));
	}}
>
	Add Instance
</Button>
