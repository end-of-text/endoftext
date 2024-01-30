<script>
	import Table from '$lib/pages/explore/Table.svelte';
	import Sidebar from '$lib/pages/explore/sidebar/Sidebar.svelte';

	let { data } = $props();
</script>

<div class="flex relative h-full">
	<Sidebar prompts={data.prompts} />
	<Table entries={data.entries} />
</div>
