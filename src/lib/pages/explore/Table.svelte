<script lang="ts">
	import type { Entry } from '$lib/types';
	import InstanceView from '../../components/Instances/InstanceView.svelte';

	let { entries } = $props<{ entries: Entry[] }>();
	let count = $derived(entries.length);
</script>

<div class="flex flex-col grow p-4">
	<div class="flex gap-10 mb-5 items-center">
		<p class="text-xl">{count} entries</p>
	</div>
	<div class="flex gap-2 flex-col">
		{#each entries as entry}
			<InstanceView {entry} />
		{/each}
	</div>
</div>
