<script lang="ts">
	import ProjectSettingsPopup from '$lib/components/popups/ProjectSettingsPopup.svelte';
	import type { Tables } from '$lib/supabase';
	import { Settings } from 'lucide-svelte';

	let { project } = $props<{
		project: Tables<'projects'>;
	}>();

	let showSettings = $state(false);
</script>

{#if showSettings}
	<ProjectSettingsPopup {project} onclose={() => (showSettings = false)} />
{/if}
<div class="flex w-full shrink-0 border-b px-6">
	<h1>{project.name}</h1>
	<button class="ml-auto" onclick={() => (showSettings = true)}>
		<Settings class="cursor-pointer transition hover:text-blue-600" />
	</button>
</div>
