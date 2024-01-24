<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/general/Button.svelte';
	import TextArea from '$lib/components/general/TextArea.svelte';

	let { data } = $props();

	let loading = $state(false);
	let dataDescription = $state(data.dataDescription);

	let disabled = $derived(dataDescription === '');
</script>

<form
	class="flex w-full h-full items-center justify-center"
	method="POST"
	use:enhance={() => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	}}
>
	<div class="flex flex-col items-start">
		<TextArea
			label="Data Description"
			placeholder="Describe the data you want to generate."
			bind:value={dataDescription}
			classNames="mb-4"
			numRows={5}
			name="dataDescription"
		/>
		{#if loading}
			<p>loading...</p>
		{:else}
			<Button {disabled}>Generate</Button>
		{/if}
	</div>
</form>
