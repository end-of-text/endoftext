<script lang="ts">
	import type { Tables } from '$lib/supabase';
	import { slide } from 'svelte/transition';

	let { prompt } = $props<{ prompt: Tables<'prompts'> }>();
</script>

<div class="mt-2 flex flex-col gap-2 rounded border bg-slate-50 p-2" transition:slide>
	<div>
		<label class="mr-2 italic text-slate-500" for="model">model:</label>
		<select class="rounded border p-1" name="model" bind:value={prompt.model}>
			<option value="gpt-3.5-turbo-0125">gpt-3.5-turbo-0125</option>
			<option value="gpt-3.5-turbo-1106">gpt-3.5-turbo-1106</option>
			<option value="gpt-4-0125-preview">gpt-4-0125-preview</option>
			<option value="gpt-4-1106-preview">gpt-4-1106-preview</option>
		</select>
	</div>
	<div>
		<label class="mr-2 italic text-slate-500" for="model">response format:</label>
		<select class="rounded border p-1" name="responseFormat" bind:value={prompt.responseFormat}>
			<option value="text">text</option>
			<option value="json">json</option>
		</select>
	</div>
	<div class="flex items-center">
		<label class="mr-2 italic text-slate-500" for="temperature">temperature:</label>
		<input
			type="range"
			name="temperature"
			bind:value={prompt.temperature}
			min="0"
			max="2"
			step="0.1"
		/>
		<span class="ml-2">{prompt.temperature}</span>
	</div>
</div>
