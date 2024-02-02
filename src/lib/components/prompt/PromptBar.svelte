<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import { selectedPrompt } from '$lib/state.svelte';
	import { Copy, Pencil, Save, Trash } from 'lucide-svelte';
	import Suggestions from './Suggestions.svelte';

	let { projectId } = $props<{ projectId: string }>();

	let editPrompt = $state(false);
</script>

<div class="w-96 shrink-0 p-2 shadow">
	<h1 class="mb-5">Prompt</h1>
	{#if selectedPrompt.prompt}
		<form method="POST" action="?/copyPrompt" use:enhance>
			<input type="hidden" name="prompt" value={JSON.stringify(selectedPrompt.prompt)} />
			<Button><Copy /> Copy</Button>
		</form>
		{#if editPrompt}
			<form method="POST" class="flex flex-col" action="?/editPrompt" use:enhance>
				<input type="hidden" name="promptId" value={selectedPrompt.prompt?.id} />
				<textarea
					class="flex-grow rounded border bg-white bg-opacity-90 p-1 text-sm"
					rows="3"
					value={selectedPrompt.prompt.prompt}
					name="newPrompt"
				/>
				<Button><Save /> Save</Button>
			</form>
		{:else}
			<p>{selectedPrompt.prompt.prompt}</p>
			<form method="POST" action="?/deletePrompt" use:enhance>
				<input type="hidden" name="promptId" value={selectedPrompt.prompt?.id} />
				<Button classNames="my-4"><Trash /> Delete</Button>
			</form>
			<Button onclick={() => (editPrompt = true)}><Pencil /> Edit</Button>
		{/if}
		<Suggestions {projectId} />
	{/if}
</div>
