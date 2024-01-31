<script lang="ts">
	import { enhance } from '$app/forms';

	const { data } = $props();
</script>

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
			</tr>
		{/each}
	</tbody>
</table>

<form method="post" use:enhance>
	<input name="name" placeholder="name" />
	<button>new project</button>
</form>
