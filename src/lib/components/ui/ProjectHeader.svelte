<script lang="ts">
	import ProjectSettingsPopup from '$lib/components/popups/ProjectSettingsPopup.svelte';
	import type { Tables } from '$lib/supabase';
	import { Settings } from 'lucide-svelte';
	import HelpButton from './HelpButton.svelte';

	let { project, prompt } = $props<{
		project: Tables<'projects'>;
		prompt: Tables<'prompts'>;
	}>();

	let showSettings = $state(false);
</script>

{#if showSettings}
	<ProjectSettingsPopup {prompt} bind:project onclose={() => (showSettings = false)} />
{/if}
<div class="flex w-full shrink-0 items-center border-b px-6">
	<a href="/home">
		<img class="h-5 pr-4" src="/logo-small.svg" alt="logo" />
	</a>
	<div class="flex items-center gap-2">
		<span class="text-gray-hovered my-4 text-xl font-semibold">{project.name}</span>
	</div>
	<div class="ml-auto flex items-center gap-3">
		<div class="pointer-events-none rounded-md bg-rose-50 px-4 py-1 text-sm font-bold text-primary">
			Beta
		</div>
		<HelpButton />
		<button onclick={() => (showSettings = true)}>
			<Settings class="h-5 w-5 cursor-pointer transition-all hover:text-primary" />
		</button>
	</div>
</div>
