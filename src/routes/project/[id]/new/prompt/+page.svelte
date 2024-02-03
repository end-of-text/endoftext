<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	let { data } = $props();

	let prompt = $state(data.prompt?.prompt || '');
	let disabled = $derived(prompt === '');
</script>

<div class="flex h-full flex-col items-center justify-center">
	<p></p>
	<form class="flex flex-col items-start" method="POST" use:enhance>
		<div class="mb-4 flex flex-col gap-2">
			<p class="mb-2 text-slate-500">1 / 2</p>
			<div class="flex items-center justify-between">
				<h1>Initial Prompt</h1>
				<Button {disabled}>Next</Button>
			</div>
			<p>
				First, create your initial prompt. This is the system prompt passed to the LLM, for example:
			</p>
			<ol>
				<li class="list-inside list-disc italic">Classify the sentiment of this movie review.</li>
				<li class="list-inside list-disc italic">
					You are a assistant for helping users with insurance claims.
				</li>
				<li class="list-inside list-disc italic">Translate this text into French.</li>
			</ol>
			<p>Don't stress, we'll help you refine it later.</p>
		</div>
		<TextArea
			placeholder="System prompt."
			bind:value={prompt}
			classNames="mb-4"
			numRows={5}
			name="prompt"
		/>
	</form>
</div>
