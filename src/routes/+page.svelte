<script>
	import Table from '$lib/table/Table.svelte';

	let { data } = $props();
</script>

<div class="m-auto p-10">
	<Table entries={data.entries} />
</div>
