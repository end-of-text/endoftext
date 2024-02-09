<script lang="ts">
	import ProjectSettingsPopup from '$lib/components/popups/ProjectSettingsPopup.svelte';
	import type { Tables } from '$lib/supabase';
	import { Home, ScrollText, Settings } from 'lucide-svelte';

	let { project } = $props<{
		project: Tables<'projects'>;
	}>();

	let showSettings = $state(false);
</script>

{#if showSettings}
	<ProjectSettingsPopup bind:project onclose={() => (showSettings = false)} />
{/if}
<div class="flex w-full border-b px-6">
	<div class="flex items-center gap-4">
		<ScrollText />
		<span class="my-4 text-xl font-semibold text-gray-700">{project.name}</span>
	</div>
	<div class="ml-auto flex items-center gap-4">
		<a href="/home">
			<Home class="cursor-pointer transition hover:text-blue-600" />
		</a>
		<button onclick={() => (showSettings = true)}>
			<Settings class="cursor-pointer transition hover:text-blue-600" />
		</button>
	</div>
</div>
