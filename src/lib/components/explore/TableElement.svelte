<script lang="ts">
	import TextArea from '$lib/components/general/TextArea.svelte';
	import { elementSelection, elementsSelected } from '$lib/stores';
	import type { Entry } from '$lib/types';

	let { entry } = $props<{ entry: Entry }>();
</script>

<div class="border rounded p-2 flex items-center">
	<TextArea bind:value={entry.text} width="w-full" plain classNames="grow" />
	{#if $elementSelection}
		<input
			type="checkbox"
			checked={$elementsSelected.findIndex((e: Entry) => e.id === entry.id) !== -1}
			class="mr-2"
			on:click={() => {
          if ($elementsSelected.findIndex((e: Entry) => e.id === entry.id) !== -1) {
            $elementsSelected = $elementsSelected.filter((e: Entry) => e.id !== entry.id);
          } else {
            $elementsSelected = [...$elementsSelected, entry];
          }
        }}
		/>
	{/if}
</div>
