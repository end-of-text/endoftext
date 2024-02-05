<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import type { Tables } from '$lib/supabase';
	import { Save, Undo2 } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import PromptOptions from '../options/PromptOptions.svelte';

	let { prompt, editedPrompt, setPrompt } = $props<{
		prompt: Tables<'prompts'>;
		editedPrompt: Tables<'prompts'>;
		setPrompt: () => void;
	}>();

	let promptWasEdited = $derived(
		JSON.stringify(prompt) === JSON.stringify(editedPrompt) ? false : true
	);
</script>

<div class="flex flex-col">
	<PromptOptions bind:prompt={editedPrompt} />
	<div
		contenteditable="plaintext-only"
		class="mt-2 h-auto overflow-hidden rounded border bg-white bg-opacity-90 p-2 text-sm"
		role="textbox"
		aria-multiline="true"
		tabindex="0"
		bind:innerText={editedPrompt.prompt}
		onkeydown={(e) => {
			if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
				setPrompt();
			}
		}}
	/>
	<div class="ml-auto mt-2 flex items-center gap-2">
		{#if promptWasEdited}
			<div class="flex items-center gap-3" transition:fade>
				<p class="text-stone-500">unsaved changes</p>
				<Button
					classNames="border-blue-400 bg-blue-50 hover:bg-blue-100"
					onclick={() => (editedPrompt = { ...prompt })}
				>
					<Undo2 />
				</Button>
			</div>
		{/if}
		<Button
			onclick={() => setPrompt()}
			classNames="w-fit {promptWasEdited
				? 'border-emerald-600 bg-emerald-50 hover:bg-emerald-100'
				: 'border'}"
		>
			<Save />
			Save and Run
		</Button>
	</div>
</div>
