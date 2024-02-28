<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { ClipboardPaste } from 'lucide-svelte';

	let { data } = $props();

	let name = $state(data.project?.name || '');
	let prompt = $state(data.prompt?.prompt || '');
	let disabled = $derived(prompt === '');
	let submitted = $state(false);
</script>

<div class="flex h-full flex-col items-center justify-center">
	<form
		class="flex flex-col items-start"
		method="POST"
		use:enhance={() => {
			submitted = true;
			return async ({ update }) => {
				update();
			};
		}}
	>
		<div class="mb-4 flex max-w-xl flex-col gap-2">
			<div class="flex items-center justify-between">
				<p class="mb-2 text-gray-active">1 / 2</p>
				<img src="/logo.svg" alt="logo" class="h-4" />
			</div>
			<h1>Initial Prompt</h1>
			<p>
				Create your initial prompt and give it a name. This is the system prompt passed to the LLM.
				Don't stress, we'll help you refine it later.
			</p>
			<p>If you're stuck, try one of these examples!</p>
			<ol class="flex flex-col gap-2 py-2">
				<li class="flex list-inside list-disc items-center justify-between italic">
					<p>Classify the sentiment of this movie review.</p>
					<Button
						onclick={(e) => {
							e.preventDefault();
							name = 'Sentiment Analysis';
							prompt = 'Classify the sentiment of this movie review.';
						}}
						title="Use"
					>
						<ClipboardPaste />
					</Button>
				</li>
				<li class="flex list-inside list-disc items-center justify-between italic">
					<p>You are a assistant for helping users with insurance claims.</p>
					<Button
						onclick={(e) => {
							e.preventDefault();
							name = 'Insurance Claims Assistant';
							prompt = 'You are a assistant for helping users with insurance claims.';
						}}
						title="Use"
					>
						<ClipboardPaste />
					</Button>
				</li>
				<li class="flex list-inside list-disc items-center justify-between italic">
					<p>Translate this text into French.</p>
					<Button
						onclick={(e) => {
							e.preventDefault();
							name = 'Translate to French';
							prompt = 'Translate this text into French.';
						}}
						title="Use"
					>
						<ClipboardPaste />
					</Button>
				</li>
			</ol>
		</div>
		<input
			type="text"
			bind:value={name}
			class="mb-4 w-full"
			name="name"
			placeholder="Prompt name"
		/>
		<textarea placeholder="Prompt" bind:value={prompt} class="mb-4 w-full" rows="5" name="prompt" />
		<div class="ml-auto flex items-center gap-2">
			{#if submitted}
				<Spinner />
			{/if}
			<Button {disabled}>Next</Button>
		</div>
	</form>
</div>
