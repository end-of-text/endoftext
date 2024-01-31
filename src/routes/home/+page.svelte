<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { createIcons, Trash2 } from 'lucide';

	if (browser)
		createIcons({
			icons: {
				Trash2
			}
		});

	const { data } = $props();
</script>

<form method="POST" use:enhance action="?/delete">
	<table class="table-auto">
		<thead class="bg-gray-200">
			<tr>
				<th class="px-4 py-2">Project Name</th>
			</tr>
		</thead>
		<tbody>
			{#each data.projects || [] as project}
				<tr class="bg-gray-100">
					<td class="border px-4 py-2">
						<a href="/project/{project.id}">{project.name}</a>
					</td>
					<td class="border px-4 py-2 transition hover:text-slate-500">
						<button name="delete" value={project.id}><i data-lucide="trash2" /></button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</form>

<form method="post" use:enhance action="?/create">
	<input name="name" placeholder="name" />
	<button>new project</button>
</form>
