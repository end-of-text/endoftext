<script lang="ts">
	import { getPrediction } from '$lib/api';
	import { selectedPrompt } from '$lib/state.svelte';
	import type { Tables } from '$lib/supabase';

	let { instance, edit = false } = $props<{ instance: Tables<'instances'>; edit?: boolean }>();
</script>

<div class="relative break-words rounded border text-left">
	<div class="flex flex-col p-4">
		{#if instance.input !== undefined}
			<div class="flex flex-row">
				{#if edit}
					<textarea
						class="flex-grow rounded border bg-white bg-opacity-90 p-1 text-sm"
						rows="3"
						bind:value={instance.input}
					/>
				{:else}
					<p class="text-grey whitespace-pre-wrap">
						{instance.input}
					</p>
				{/if}
			</div>
		{/if}
		<div class="mt-2 text-sm text-gray-400">label</div>
		<div class="flex flex-row">
			{#if edit}
				<textarea
					class="flex-grow rounded border bg-white bg-opacity-90 p-1 text-sm"
					rows="3"
					bind:value={instance.label}
				/>
			{:else}
				<p class="text-grey whitespace-pre-wrap">
					{instance.label}
				</p>
			{/if}
		</div>
		{#if selectedPrompt.prompt !== undefined}
			<div class="mt-2 text-sm text-gray-400">output</div>
			<div class="flex flex-row">
				<p class="text-grey whitespace-pre-wrap">
					{#await getPrediction(selectedPrompt.prompt, instance)}
						Loading...
					{:then prediction}
						{prediction?.prediction}
					{/await}
				</p>
			</div>
		{/if}
	</div>
	<!--{#if output}
		<div class="absolute right-4 top-4 rounded border bg-white bg-opacity-90 p-1 text-sm">
			score: {output?.metric}
		</div>
	{/if}-->
</div>
