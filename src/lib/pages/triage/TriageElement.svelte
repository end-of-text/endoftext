<script lang="ts">
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import type { Entry } from '$lib/types';
	import { createEventDispatcher } from 'svelte';

	let { entry } = $props<{ entry: Entry }>();

	const dispatch = createEventDispatcher();

	function deleteEntry() {
		dispatch('delete');
	}
</script>

<div class="border rounded my-2 p-2 flex items-center">
	<TextArea bind:value={entry.question} width="w-full" plain classNames="grow" />
	<TextArea bind:value={entry.answer} width="w-full" plain classNames="grow" />
	<div>
		<button class="bg-red-500 text-white rounded p-2 m-1" on:click={deleteEntry}>Delete</button>
	</div>
</div>
