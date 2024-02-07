<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import { Home, Trash2, User2 } from 'lucide-svelte';

	const { data } = $props();
</script>

<div class="mx-auto my-auto flex min-h-0 w-full max-w-4xl grow gap-2">
	<div class="flex w-1/6 flex-col gap-6">
		<div class="flex gap-2">
			<Home />
			All Prompts
		</div>
		<div class="flex gap-2">
			<User2 />
			Account
		</div>
	</div>
	<div class="w-5/6 border-l pl-6">
		<div class="mb-4 flex items-center justify-between">
			<h1>Prompts</h1>
			<form class="flex" method="post" use:enhance action="?/create">
				<Button fancy>New Prompt</Button>
			</form>
		</div>
		{#if data.projects.length === 0}
			<div class="mt-6">
				<h2>Welcome to Prompt Optimizer!</h2>
				<p>You don't have any prompts, create one to get started.</p>
			</div>
		{:else}
			<div class="grid grid-cols-3 gap-4">
				{#each data.projects as project (project.id)}
					<a
						class="flex h-24 gap-2 rounded border p-2 hover:bg-slate-100"
						href="/project/{project.id}"
					>
						<p class="w-full px-4 py-2 transition">
							{project.name}
						</p>
						<form method="POST" use:enhance action="?/delete">
							<button
								class="ml-auto rounded p-2 transition hover:bg-slate-200 hover:text-red-600"
								name="delete"
								value={project.id}
								onclick={(e) => e.stopPropagation()}
							>
								<Trash2 />
							</button>
						</form>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
