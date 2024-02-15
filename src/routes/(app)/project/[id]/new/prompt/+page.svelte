<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';

	let { data } = $props();

	let name = $state(data.project?.name || '');
	let prompt = $state(data.prompt?.prompt || '');
	let disabled = $derived(prompt === '');
</script>

<div class="flex h-full flex-col items-center justify-center">
	<form class="flex flex-col items-start" method="POST" use:enhance>
		<div class="mb-4 flex max-w-xl flex-col gap-2">
			<div class="flex items-center justify-between">
				<p class="mb-2 text-gray-500">1 / 2</p>
				<img src="/logo.svg" alt="logo" class="h-4" />
			</div>
			<h1>Initial Prompt</h1>
			<p>
				Create your initial prompt and give it a name. This is the system prompt passed to the LLM.
				Some examples include:
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
		<input
			type="text"
			bind:value={name}
			class="mb-4 w-full"
			name="name"
			placeholder="Prompt name"
		/>
		<textarea placeholder="Prompt" bind:value={prompt} class="mb-4 w-full" rows="5" name="prompt" />
		<Button classNames="ml-auto" {disabled}>Next</Button>
	</form>
</div>
