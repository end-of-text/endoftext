<script lang="ts">
	import type { Tables } from '$lib/supabase';
	import InstanceTableRow from './InstanceTableRow.svelte';

	let { instances } = $props<{ instances: Tables<'instances'>[] }>();
</script>

<table class="w-full table-auto">
	<thead class="text-left">
		<tr class="border-b-2">
			<th>Input</th>
			<th>Label</th>
			<th>Prediction</th>
			<th>Metric</th>
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each instances as instance (instance.id)}
			<InstanceTableRow {instance} />
		{/each}
	</tbody>
</table>
