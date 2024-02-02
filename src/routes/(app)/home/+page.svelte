<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Trash from '$lib/components/icons/Trash.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const { data } = $props();
</script>

{#if data.projects && data.projects.length > 0}
	<form method="POST" use:enhance action="?/delete">
		<table class="table-auto">
			<thead class="">
				<tr>
					<th class="py-2 pl-2 text-left">Project Name</th>
					<th class="px-4 py-2 text-center">
						<Trash />
					</th>
				</tr>
			</thead>
			<tbody>
				{#each data.projects as project (project.id)}
					<tr class="border-t">
						<td
							class="border-top cursor-default py-2 pl-2 pr-4 transition hover:bg-slate-100"
							onclick={() => goto('/project/' + project.id)}
						>
							{project.name}
						</td>
						<td class="border-top px-4 py-2 transition hover:text-slate-500">
							<button name="delete" value={project.id}>
								<Trash />
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</form>
{/if}

<form class="mt-4 flex" method="post" use:enhance action="?/create">
	<input name="name" placeholder="name" />
	<Button fancy classNames="ml-2">new project</Button>
</form>
