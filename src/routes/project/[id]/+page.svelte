<script>
	import { enhance } from '$app/forms';

	let { data } = $props();

	let currentPrompt = $state(data.prompts?.[0] || { id: -1, prompt: '' });
	let editPrompt = $state(false);
</script>

<div class="flex h-full w-full">
	<div class="w-2/3 border-r-2 p-5">
		<h1 class="mb-5">Data</h1>
		<h2>all prompts</h2>
		{#if data.prompts}
			<div class="flex flex-wrap gap-2">
				{#each data.prompts as prompt, index (prompt.id)}
					<button
						class="rounded border px-2 py-1 {currentPrompt.id === prompt.id
							? 'bg-slate-200'
							: 'bg-slate-50'} transition hover:bg-slate-300"
						onclick={() => (currentPrompt = prompt)}>{prompt.prompt}</button
					>
					{#if index < data.prompts.length - 1}
						<span class="mx-2">→</span>
					{/if}
				{/each}
			</div>
		{/if}
		<form method="POST" action="?/copyPrompt" use:enhance>
			<input type="hidden" name="prompt" value={currentPrompt.prompt} />
			<button class="btn">copy prompt</button>
		</form>
		<h2>current prompt</h2>
		{#if editPrompt}
			<form method="POST" action="?/editPrompt" use:enhance>
				<input type="hidden" name="promptId" value={currentPrompt.id} />
				<input name="newPrompt" value={currentPrompt.prompt} />
				<button class="btn">save</button>
			</form>
		{:else}
			<p>{currentPrompt.prompt}</p>
			<form method="POST" action="?/deletePrompt" use:enhance>
				<input type="hidden" name="promptId" value={currentPrompt.id} />
				<button class="btn">delete prompt</button>
			</form>
			<button class="btn" on:click={() => (editPrompt = true)}>edit prompt</button>
		{/if}
		<h2>instances</h2>
		{#if data.instances}
			{#each data.instances as instance}
				<p>{instance.input}</p>
			{/each}
		{/if}
	</div>
	<div class="w-1/3 p-5"><h1 class="mb-5">Prompts</h1></div>
</div>
