<script lang="ts">
	import { enhance } from '$app/forms';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	let loading = $state(false);
	let task = $state('');
	let disabled = $derived(task === '');
</script>

<div class="flex h-full flex-col items-center justify-center">
	<form
		class="flex flex-col items-start"
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				loading = false;
				update();
			};
		}}
	>
		<h1>Optimize your Prompt</h1>
		<TextArea
			placeholder="Describe the task of the desired AI agent."
			bind:value={task}
			classNames="mb-4"
			numRows={5}
			name="prompt"
		/>
		{#if loading}
			<p>loading...</p>
		{:else}
			<button class="btn" {disabled}>Optimize</button>
		{/if}
	</form>
</div>
