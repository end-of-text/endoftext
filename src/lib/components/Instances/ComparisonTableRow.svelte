<script lang="ts">
	import type { Tables } from '$lib/supabase';
	import autosize from 'autosize';

	let { instance, promptIds, predictions } = $props<{
		instance: Tables<'instances'>;
		promptIds: number[];
		predictions: Record<number, string>;
	}>();
</script>

<tr class="group border-b align-top text-sm">
	<td class="h-full p-2">
		<textarea use:autosize class="box-border w-full border-none" value={instance.input} disabled />
	</td>
	{#each promptIds as promptId}
		<td class="h-full p-2">
			<textarea
				use:autosize
				class="box-border w-full border-none"
				value={predictions[promptId]}
				disabled
			/>
		</td>
	{/each}
</tr>
