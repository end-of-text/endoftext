<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import { PlusCircle, Trash2 } from 'lucide-svelte';

	const { data } = $props();
</script>

<div class="mb-4 flex items-center justify-between">
	<h1>Your Prompts</h1>
	<form class="flex" method="post" use:enhance action="?/create">
		<Button title="New Prompt" classNames="text-green-600">
			<PlusCircle class="h-5 w-5" />
		</Button>
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
				class="flex min-h-24 gap-2 rounded border p-2 transition-all hover:shadow"
				href="/project/{project.id}"
			>
				<p class="w-full px-4 py-2 transition">
					{project.name}
				</p>
				<form method="POST" use:enhance action="?/delete">
					<button
						class="ml-auto p-2 transition-all hover:text-red-600"
						name="delete"
						value={project.id}
						onclick={(e) => e.stopPropagation()}
					>
						<Trash2 class="h-5 w-5" />
					</button>
				</form>
			</a>
		{/each}
	</div>
{/if}
