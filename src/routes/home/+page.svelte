<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import { Trash } from 'lucide-svelte';

	const { data } = $props();
</script>

{#if data.projects && data.projects.length > 0}
	<form method="POST" use:enhance action="?/delete">
		<table class="table-auto">
			<thead class="bg-gray-200">
				<tr>
					<th class="px-4 py-2">Project Name</th>
				</tr>
			</thead>
			<tbody>
				{#each data.projects as project (project.id)}
					<tr class="bg-gray-100">
						<td class="border px-4 py-2">
							<a href="/project/{project.id}">{project.name}</a>
						</td>
						<td class="border px-4 py-2 transition hover:text-slate-500">
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
