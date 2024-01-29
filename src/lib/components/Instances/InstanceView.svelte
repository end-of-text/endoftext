<script lang="ts">
	import { selectedPrompt } from '$lib/stores';
	import type { Entry } from '$lib/types';

	let { entry } = $props<{ entry: Entry }>();

	async function getPrediction(): Promise<string | undefined> {
		if ($selectedPrompt !== undefined) {
			const res = await fetch(`/api/prompt/${$selectedPrompt.id}/answer/${entry.id}`, {
				method: 'GET'
			});
			return await res.text();
		}
		return undefined;
	}
</script>

<div class="cursor-default overflow-x-auto break-words rounded border" tabindex="0" role="button">
	<div class="p-4">
		{#if entry.question !== undefined}
			<div class="flex flex-row">
				<p class="whitespace-pre-wrap text-grey">
					{entry.question}
				</p>
			</div>
		{/if}
		{#if entry.answer !== undefined}
			<div class="mt-2 text-sm text-gray-400">label</div>
			<div class="flex flex-row">
				<p class="whitespace-pre-wrap text-grey">
					{entry.answer}
				</p>
			</div>
		{/if}
		{#if $selectedPrompt !== undefined}
			<div class="mt-2 text-sm text-gray-400">output</div>
			<div class="flex flex-row">
				{#await getPrediction()}
					loading..
				{:then prediction}
					{#if prediction !== undefined}
						<p class="whitespace-pre-wrap text-grey">
							{prediction}
						</p>
					{/if}
				{/await}
			</div>
		{/if}
	</div>
</div>
