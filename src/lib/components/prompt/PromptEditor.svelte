<script lang="ts">
	import { updatePrompt } from '$lib/api';
	import type { Tables } from '$lib/supabase';
	import { Save, Undo2 } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import Button from '../ui/Button.svelte';

	let { prompt, editedPrompt } = $props<{
		prompt: Tables<'prompts'>;
		editedPrompt: string;
	}>();

	let promptWasEdited = $derived(prompt.prompt === editedPrompt ? false : true);
</script>

<div class="flex flex-col">
	<div
		contenteditable="plaintext-only"
		class="h-auto flex-grow overflow-hidden rounded border bg-white bg-opacity-90 p-2 text-sm"
		bind:innerText={editedPrompt}
		role="textbox"
		aria-multiline="true"
		tabindex="0"
		onkeydown={(e) => {
			if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
				updatePrompt(prompt.id, editedPrompt);
				prompt = { ...prompt, prompt: editedPrompt };
			}
		}}
	/>
	<div class="ml-auto mt-2 flex items-center gap-2">
		{#if promptWasEdited}
			<div class="flex items-center gap-3" transition:fade>
				<p class="text-stone-500">unsaved changes</p>
				<Button
					classNames="border-blue-400 bg-blue-50 hover:bg-blue-100"
					onclick={(e) => {
						e.preventDefault();
						editedPrompt = prompt.prompt;
					}}
				>
					<Undo2 />
				</Button>
			</div>
		{/if}
		<Button
			onclick={() => {
				updatePrompt(prompt.id, editedPrompt);
				prompt = { ...prompt, prompt: editedPrompt };
			}}
			classNames="w-fit {promptWasEdited
				? 'border-emerald-600 bg-emerald-50 hover:bg-emerald-100'
				: 'border'}"><Save /> Save and Run</Button
		>
	</div>
</div>
