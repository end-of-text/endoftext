<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import ProjectSettingsPopup from '$lib/components/popups/ProjectSettingsPopup.svelte';
	import type { Tables } from '$lib/supabase';
	import { Settings } from 'lucide-svelte';
	import HelpButton from './HelpButton.svelte';

	let { project } = $props<{
		project: Tables<'projects'>;
	}>();

	let showSettings = $state(false);
</script>

{#if showSettings}
	<ProjectSettingsPopup bind:project onclose={() => (showSettings = false)} />
{/if}
<div class="flex w-full shrink-0 items-center border-b px-6">
	<a href="/home">
		<img class="h-5 pr-4" src="/logo-small.svg" alt="logo" />
	</a>
	<div class="flex items-center gap-2">
		<span class="my-4 text-xl font-semibold text-gray-700">{project.name}</span>
	</div>
	<div class="ml-auto flex items-end gap-2 pr-8 font-semibold">
		<a
			href="/project/{project.id}"
			class="{browser && !$page.url.href.includes('prompt')
				? 'underline decoration-primary decoration-2'
				: ''} transition-all hover:text-primary">Overview</a
		>
		<a
			href="/project/{project.id}/prompt"
			class="{browser && $page.url.href.includes('prompt')
				? 'underline decoration-primary decoration-2'
				: ''} transition-all hover:text-primary">Prompt</a
		>
	</div>
	<div class="flex items-center gap-3">
		<div class="pointer-events-none rounded-md bg-rose-50 px-4 py-1 text-sm font-bold text-primary">
			Beta
		</div>
		<HelpButton />
		<button onclick={() => (showSettings = true)}>
			<Settings class="h-5 w-5 cursor-pointer transition-all hover:text-primary" />
		</button>
	</div>
</div>
