<script lang="ts">
	import { getMetric, getPrediction } from '$lib/api';
	import { selectedPrompt } from '$lib/state.svelte';
	import type { Instance } from '$lib/types';
	import { Pencil } from 'lucide-svelte';
	import InstancePopup from '../popups/InstancePopup.svelte';
	import Button from '../ui/Button.svelte';

	let { instance } = $props<{ instance: Instance }>();

	let editInstance = $state(false);

	let prediction = $derived(getPrediction(selectedPrompt.prompt, instance));
	let metric = $derived(getMetric(instance, prediction));
</script>

{#if editInstance}
	<InstancePopup {instance} onclose={() => (editInstance = false)} />
{/if}

<tr class="border-b-2">
	<td class="py-2">{instance.input}</td>
	<td class="py-2">{instance.label}</td>
	<td class="py-2">
		{#await prediction}
			Loading...
		{:then prediction}
			{prediction?.prediction || ''}
		{/await}
	</td>
	<td class="py-2">
		{#await metric}
			Loading...
		{:then metric}
			{metric?.metric || ''}
		{/await}</td
	>
	<td>
		<Button onclick={() => (editInstance = true)}><Pencil /></Button>
	</td>
</tr>
