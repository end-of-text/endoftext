<script lang="ts">
	import { getPrediction, updateInstance } from '$lib/api';
	import type { Tables } from '$lib/supabase';
	import { Trash2 } from 'lucide-svelte';
	import InstancePopup from '../popups/InstancePopup.svelte';

	let { instance, prompt, removeInstance } = $props<{
		instance: Tables<'instances'>;
		prompt: Tables<'prompts'>;
		removeInstance: (id: number) => void;
	}>();

	let editInstance = $state(false);
	let localInstanceInput = $state(instance.input);

	let prediction = $derived(getPrediction(prompt, instance));
</script>

{#if editInstance}
	<InstancePopup {instance} onclose={() => (editInstance = false)} />
{/if}

<tr class="border-b-2">
	<td
		class="box-border px-2 py-2"
		contenteditable="plaintext-only"
		bind:innerText={localInstanceInput}
		onblur={() => {
			updateInstance({ ...instance, input: localInstanceInput });
			instance.input = localInstanceInput;
		}}
		on:keydown={(event) => {
			if (event.key === 'Enter' && (event.shiftKey || event.metaKey)) {
				event.currentTarget.blur();
			}
		}}
	>
		{instance.input}
	</td>
	<td class="px-2 py-2">
		{#await prediction}
			Loading...
		{:then pred}
			{pred}
		{/await}
	</td>
	<td>
		<button onclick={() => removeInstance(instance.id)}>
			<Trash2 class="cursor-pointer transition hover:text-red-600" />
		</button>
	</td>
</tr>
