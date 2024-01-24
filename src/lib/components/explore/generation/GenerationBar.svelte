<script lang="ts">
	import Select from '$lib/components/general/Select.svelte';
	import { GenerationTypes } from '$lib/types';
	import type { ComponentType } from 'svelte';
	import Prompt from './Prompt.svelte';
	import Similar from './Similar.svelte';

	let generationType = $state(GenerationTypes.PROMPT);

	const barMap: Record<string, ComponentType> = {
		[GenerationTypes.PROMPT]: Prompt,
		[GenerationTypes.SIMILAR]: Similar
	};
</script>

<div class="flex flex-col w-96">
	<Select
		bind:value={generationType}
		options={[
			{ value: GenerationTypes.PROMPT, label: 'Prompt' },
			{
				value: GenerationTypes.SIMILAR,
				label: 'Similar'
			}
		]}
		classNames="p-2"
	/>
	<svelte:component this={barMap[generationType]} />
</div>
