<script lang="ts">
	import ProjectHeader from '$lib/components/ui/ProjectHeader.svelte';

	let { data, children } = $props();

	let project = $state(data.project);
</script>

<div class="flex h-full w-full flex-col">
	<ProjectHeader bind:project />
	<div class="flex min-h-0 grow">
		{@render children()}
	</div>
</div>
