<script lang="ts">
	import type { Instance } from '$lib/types';
	import InstanceTableRow from './InstanceTableRow.svelte';

	let { instances } = $props<{ instances: Instance[] }>();
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
