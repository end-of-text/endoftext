<script>
	let { data } = $props();
</script>

<div class="relative h-full">
	<h2>prompt</h2>
	{#if data.prompts}
		<p>{data.prompts[0].prompt}</p>
	{/if}
	<h2>instances</h2>
	{#if data.instances}
		{#each data.instances as instance}
			<p>{instance.input}</p>
		{/each}
	{/if}
</div>
