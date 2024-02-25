<script lang="ts">
	import { tooltipState } from '$lib/tooltip.svelte';
	import { fade } from 'svelte/transition';

	let windowWidth = $state(0);
	let windowHeight = $state(0);
	let tooltipWidth = $state(0);
	let tooltipHeight = $state(0);

	const yPos = $derived(
		windowHeight > tooltipState.tooltip.mousePos.y + tooltipHeight + 20
			? tooltipState.tooltip.mousePos.y
			: tooltipState.tooltip.mousePos.y - tooltipHeight - 20
	);
	const xStyle = $derived(
		windowWidth > tooltipState.tooltip.mousePos.x + tooltipWidth + 10
			? `left: ${tooltipState.tooltip.mousePos.x}px;`
			: `right: 10px;`
	);
	const style = $derived(`top: ${yPos}px; ${xStyle}; max-width: 50%`);
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />
{#if tooltipState.tooltip.hover && tooltipState.tooltip.text !== undefined}
	<div
		class="fixed z-40 my-4 flex rounded bg-gray-hovered p-1 text-xs text-white shadow"
		{style}
		out:fade
		in:fade={{ delay: 1000 }}
		bind:offsetWidth={tooltipWidth}
		bind:offsetHeight={tooltipHeight}
	>
		<div class="break-word flex flex-col p-1">
			{tooltipState.tooltip.text}
		</div>
	</div>
{/if}
