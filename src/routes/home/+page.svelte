<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import { Trash2 } from 'lucide-svelte';

	const { data } = $props();
</script>

{#if data.projects.length === 0}
	<h1>Welcome to Prompt Optimizer!</h1>
	<p>Create your first project and start improving your prompts.</p>
{:else}
	<form method="POST" use:enhance action="?/delete">
		<h1>Projects</h1>
		{#each data.projects as project (project.id)}
			<div class="flex items-center gap-2 border-b">
				<a class="w-full px-4 py-2 transition hover:bg-slate-100" href="/project/{project.id}">
					{project.name}
				</a>
				<button class="ml-auto transition hover:text-red-600" name="delete" value={project.id}>
					<Trash2 />
				</button>
			</div>
		{/each}
	</form>
{/if}

<form class="mt-10 flex" method="post" use:enhance action="?/create">
	<input name="name" placeholder="name" />
	<Button fancy classNames="ml-2">new project</Button>
</form>
