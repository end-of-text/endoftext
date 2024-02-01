<script lang="ts">
	import type { Instance } from '$lib/types';

	let { instance } = $props<{ instance: Instance }>();
</script>

<div class="relative break-words rounded border">
	<div class="p-4">
		{#if instance.input !== undefined}
			<div class="flex flex-row">
				<p class="text-grey whitespace-pre-wrap">
					{instance.input}
				</p>
			</div>
		{/if}
		{#if instance.label !== undefined}
			<div class="mt-2 text-sm text-gray-400">label</div>
			<div class="flex flex-row">
				<p class="text-grey whitespace-pre-wrap">
					{instance.label}
				</p>
			</div>
		{/if}
		<!--
		{#if output !== undefined}
			<div class="mt-2 text-sm text-gray-400">output</div>
			<div class="flex flex-row">
				<p class="text-grey whitespace-pre-wrap">
					{output.text}
				</p>
			</div>
		{/if}-->
	</div>
	<!--{#if output}
		<div class="absolute right-4 top-4 rounded border bg-white bg-opacity-90 p-1 text-sm">
			score: {output?.metric}
		</div>
	{/if}-->
</div>
