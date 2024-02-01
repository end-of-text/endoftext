<script>
	import { enhance } from '$app/forms';
	import { selectedPrompt } from '$lib/state.svelte';
	import Button from '../ui/Button.svelte';

	let editPrompt = $state(false);
</script>

<div class="w-96 shrink-0 p-2 shadow">
	<h1 class="mb-5">Prompt</h1>
	{#if selectedPrompt.prompt}
		<form method="POST" action="?/copyPrompt" use:enhance>
			<input type="hidden" name="prompt" value={selectedPrompt.prompt.prompt} />
			<Button>copy prompt</Button>
		</form>
		<h2>current prompt</h2>
		{#if editPrompt}
			<form method="POST" class="flex flex-col" action="?/editPrompt" use:enhance>
				<input type="hidden" name="promptId" value={selectedPrompt.prompt?.id} />
				<textarea
					class="flex-grow rounded border bg-white bg-opacity-90 p-1 text-sm"
					rows="3"
					value={selectedPrompt.prompt.prompt}
					name="newPrompt"
				/>
				<Button>save</Button>
			</form>
		{:else}
			<p>{selectedPrompt.prompt.prompt}</p>
			<form method="POST" action="?/deletePrompt" use:enhance>
				<input type="hidden" name="promptId" value={selectedPrompt.prompt?.id} />
				<Button classNames="my-4">delete prompt</Button>
			</form>
			<Button onclick={() => (editPrompt = true)}>edit prompt</Button>
		{/if}
	{/if}
</div>
