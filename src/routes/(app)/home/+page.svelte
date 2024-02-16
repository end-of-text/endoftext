<script lang="ts">
	import { enhance } from '$app/forms';
	import { deleteProject } from '$lib/api.js';
	import Confirm from '$lib/components/popups/Confirm.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { PlusCircle, Trash2 } from 'lucide-svelte';

	const { data } = $props();

	let projects = $state(data.projects);

	let deleteId = $state<string | undefined>(undefined);
</script>

{#if deleteId}
	<Confirm
		message={'Are you sure you want to delete this prompt?'}
		confirmText="Delete"
		cancelText="Cancel"
		confirm={() => {
			deleteProject(deleteId ?? '');
			projects = projects.filter((p) => p.id !== deleteId);
			deleteId = undefined;
		}}
		cancel={() => (deleteId = undefined)}
		confirmIsDelete
	/>
{/if}

<div class="mb-4 flex items-center justify-between">
	<h1>Your Prompts</h1>
	<form class="flex" method="post" use:enhance action="?/create">
		<Button title="New Prompt" classNames="text-green-600">
			<PlusCircle class="h-5 w-5" />
		</Button>
	</form>
</div>
{#if projects.length === 0}
	<div class="mt-6">
		<h2>Welcome!</h2>
		<p>You don't have any prompts, create one to get started.</p>
	</div>
{:else}
	<div class="grid grid-cols-3 gap-4">
		{#each projects as project (project.id)}
			<a
				class="flex min-h-24 gap-2 rounded border p-2 transition-all hover:shadow"
				href="/project/{project.id}"
			>
				<p class="w-full px-4 py-2 transition">
					{project.name}
				</p>
				<div
					class="ml-auto p-2 transition-all hover:text-red-600"
					onclick={(e) => {
						deleteId = project.id;
						e.preventDefault();
						e.stopPropagation();
					}}
					tabindex="0"
					role="button"
					onkeydown={() => undefined}
				>
					<Trash2 class="h-5 w-5" />
				</div>
			</a>
		{/each}
	</div>
{/if}
