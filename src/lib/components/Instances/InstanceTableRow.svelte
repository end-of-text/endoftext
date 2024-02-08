<script lang="ts">
	import { getPrediction, updateInstance } from '$lib/api';
	import type { Tables } from '$lib/supabase';
	import { Trash2 } from 'lucide-svelte';

	let { instance, prompt, selected, removeInstance } = $props<{
		instance: Tables<'instances'>;
		prompt: Tables<'prompts'>;
		selected: boolean;
		removeInstance: (id: number) => void;
	}>();

	let localInstanceInput = $state(instance.input);
	let localInstanceLabel = $state(instance.label);

	let prediction = $derived(getPrediction(prompt, instance.id, instance.input));
</script>

<tr class="border-b align-top text-sm">
	<td class="p-3 align-top">
		<input bind:checked={selected} type="checkbox" />
	</td>
	<td
		contenteditable="plaintext-only"
		class="box-border p-3"
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
	<td class="p-3">
		{#await prediction}
			Loading...
		{:then pred}
			{pred}
		{/await}
	</td>
	<td
		contenteditable="plaintext-only"
		class="box-border p-3"
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
	<td class="flex justify-end p-3">
		<button onclick={() => removeInstance(instance.id)}>
			<Trash2 class="cursor-pointer transition  hover:text-red-600" />
		</button>
	</td>
</tr>
