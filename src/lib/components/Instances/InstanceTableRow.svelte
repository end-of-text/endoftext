<script lang="ts">
	import { getPrediction, updateInstance } from '$lib/api';
	import type { Tables } from '$lib/supabase';
	import { Trash2 } from 'lucide-svelte';

	let { instance, prompt, removeInstance } = $props<{
		instance: Tables<'instances'>;
		prompt: Tables<'prompts'>;
		removeInstance: (id: number) => void;
	}>();

	let localInstanceInput = $state(instance.input);
	let localInstanceLabel = $state(instance.label);

	let prediction = $derived(getPrediction(prompt, instance.id, instance.input));
</script>

<tr class="border-b-2">
	<td
		contenteditable="plaintext-only"
		class="box-border px-2 py-2 align-top"
		bind:innerText={localInstanceInput}
		onblur={() => {
			updateInstance({ ...instance, input: localInstanceInput }).then(() => {
				instance.input = localInstanceInput;
			});
		}}
		onkeydown={(event) => {
			if (event.key === 'Enter' && (event.shiftKey || event.metaKey)) {
				event.currentTarget.blur();
			}
		}}
	/>
	<td
		contenteditable="plaintext-only"
		class="box-border px-2 py-2 align-top"
		bind:innerText={localInstanceLabel}
		onblur={() => {
			updateInstance({ ...instance, label: localInstanceLabel }).then(() => {
				instance.label = localInstanceLabel;
			});
		}}
		onkeydown={(event) => {
			if (event.key === 'Enter' && (event.shiftKey || event.metaKey)) {
				event.currentTarget.blur();
			}
		}}
	/>
	<td class="px-2 py-2">
		{#await prediction}
			Loading...
		{:then pred}
			{pred}
		{/await}
	</td>
	<td class="flex justify-end p-2">
		<button onclick={() => removeInstance(instance.id)}>
			<Trash2 class="cursor-pointer transition hover:text-red-600" />
		</button>
	</td>
</tr>
