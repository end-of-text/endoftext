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
	<ProjectSettingsPopup bind:project onclose={() => (showSettings = false)} />
{/if}
<div class="flex w-full items-center border-b px-6">
	<a href="/home">
		<img class="h-5 pr-4" src="/logo-small.svg" alt="logo" />
	</a>
	<div class="flex items-center gap-2">
		<span class="my-4 text-xl font-semibold text-gray-700">{project.name}</span>
	</div>
	<div class="ml-auto flex items-center gap-4">
		<button onclick={() => (showSettings = true)}>
			<Settings class="h-5 w-5 cursor-pointer transition-all hover:text-blue-600" />
		</button>
	</div>
</div>
