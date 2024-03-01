<script lang="ts">
	import { enhance } from '$app/forms';
	import { deleteProject } from '$lib/api.js';
	import HomeElement from '$lib/components/home/HomeElement.svelte';
	import Confirm from '$lib/components/popups/Confirm.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { PlusCircle } from 'lucide-svelte';

	const { data } = $props();

	let projects = $state(data.projects);
	let deleteId = $state<string | null>(null);
	let searchQuery = $state<string>('');

	$effect(() => {
		projects = data.projects;
	});
</script>

{#if deleteId}
	<Confirm
		message={'Are you sure you want to delete this prompt?'}
		confirmText="Delete"
		cancelText="Cancel"
		confirm={() => {
			deleteProject(deleteId ?? '');
			projects = projects.filter((p) => p.id !== deleteId);
			deleteId = null;
		}}
		cancel={() => (deleteId = null)}
		confirmIsDelete
	/>
{/if}

<div class="mb-4 flex items-center justify-between">
	<div class="flex items-center gap-5">
		<h1>Your Prompts</h1>
		<input bind:value={searchQuery} type="text" placeholder="Search" class="rounded border" />
	</div>
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
	<div class="grid grid-cols-2 gap-4 pb-10">
		{#each searchQuery.length === 0 ? projects : projects.filter((p) => p.name
						.toLowerCase()
						.includes(searchQuery.toLowerCase())) as project (project.id)}
			<HomeElement {project} deleteProject={(id) => (deleteId = id)} />
		{/each}
	</div>
{/if}
