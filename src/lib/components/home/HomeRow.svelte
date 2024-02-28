<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { clickOutside } from '$lib/clickOutside';
	import type { Tables } from '$lib/supabase';
	import { Copy, MoreHorizontal, Trash2 } from 'lucide-svelte';

	let { project, deleteProject } = $props<{
		project: Tables<'home_entries'>;
		deleteProject: (id: string | null) => void;
	}>();

	let showOptions = $state(false);

	function copyProject() {
		fetch(`/api/project/${project.id}/copy`, {
			method: 'PUT'
		}).then(() => invalidate('home_entries'));
	}

	function getUpdatedString(date: Date): string {
		const now = new Date();
		const diffInSeconds = (now.getTime() - date.getTime()) / 1000;
		const secondsInAMinute = 60;
		const secondsInAnHour = 3600;
		const secondsInADay = 86400;
		const secondsInAWeek = 604800;
		const secondsInAMonth = 2592000;
		const secondsInAYear = 31536000;

		if (diffInSeconds < secondsInAMinute) {
			return '< 1 minute';
		} else if (diffInSeconds < secondsInAnHour) {
			return `${Math.floor(diffInSeconds / secondsInAMinute)}m`;
		} else if (diffInSeconds < secondsInADay) {
			return `${Math.floor(diffInSeconds / secondsInAnHour)}h`;
		} else if (diffInSeconds < secondsInAWeek) {
			return `${Math.floor(diffInSeconds / secondsInADay)}d`;
		} else if (diffInSeconds < secondsInAMonth) {
			return `${Math.floor(diffInSeconds / secondsInAWeek)}w`;
		} else if (diffInSeconds < secondsInAYear) {
			return `${Math.floor(diffInSeconds / secondsInAMonth)}mo`;
		} else {
			return `${Math.floor(diffInSeconds / secondsInAYear)}y`;
		}
	}
</script>

<a
	class="relative min-h-12 gap-2 rounded border p-4 transition-all hover:shadow"
	href="/project/{project.id}"
>
	<div class="flex justify-between">
		<p class="w-full transition">
			{project.name}
		</p>
		<div use:clickOutside={() => (showOptions = false)}>
			<button
				class="text-gray-active transition hover:text-gray-hovered"
				onclick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					showOptions = !showOptions;
				}}
			>
				<MoreHorizontal />
			</button>
			{#if showOptions}
				<div class="absolute right-3 top-10 z-20 rounded border border-gray-inactive bg-white">
					<div class="flex flex-col gap-2 p-2">
						<button
							class="mx-2 flex cursor-pointer items-center gap-2 text-gray-active transition-all hover:text-gray-hovered"
							onclick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								copyProject();
								showOptions = false;
							}}
						>
							<Copy class="h-5 w-5" />
							<span class="whitespace-nowrap text-sm">Copy</span>
						</button>
						<button
							class="mx-2 flex cursor-pointer items-center gap-2 text-gray-active transition-all hover:text-gray-hovered"
							onclick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								deleteProject(project.id);
								showOptions = false;
							}}
						>
							<Trash2 class="h-5 w-5" />
							<span class="whitespace-nowrap text-sm">Delete</span>
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
	<p class="text-sm text-gray-active">
		Updated {getUpdatedString(new Date(project.updated_at ?? ''))} ago
	</p>
</a>
