<script lang="ts">
	import InstanceView from '$lib/components/Instances/InstanceView.svelte';
	import type { Entry } from '$lib/types';

	let { entries } = $props<{ entries: Entry[] }>();
	let count = $derived(entries.length);
</script>

<div class="flex grow flex-col p-4">
	<h2>{count} entries</h2>
	<div class="flex flex-col gap-2 overflow-y-auto">
		{#each entries as entry}
			<InstanceView {entry} />
		{/each}
	</div>
</div>
