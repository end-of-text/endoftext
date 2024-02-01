<script lang="ts">
	import PromptBar from '$lib/components/prompt/PromptBar.svelte';
	import PromptTree from '$lib/components/prompt/PromptTree.svelte';

	let { data } = $props();
</script>

<div class="flex h-full w-full">
	<div class="flex grow flex-col p-2">
		<h1>Data</h1>
		<PromptTree prompts={data.prompts} />
		<h2 class="mt-4">instances</h2>
		{#if data.instances}
			<table class="w-full table-auto">
				<thead>
					<tr class="border-b-2">
						<th>Instance Input</th>
					</tr>
				</thead>
				<tbody>
					{#each data.instances as instance}
						<tr class="border-b-2">
							<td class="py-2">{instance.input}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
	<PromptBar />
</div>
