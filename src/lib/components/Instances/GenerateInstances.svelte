<script lang="ts">
	import { clickOutside } from '$lib/clickOutside';
	import Button from '$lib/components/ui/Button.svelte';
	import { Sparkle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let { createInstances } = $props<{
		createInstances: (instruction: string, count: number) => void;
	}>();

	let showGenerateOptions = $state(false);
	let generationInstruction = $state('');
	let generationCount = $state(5);
</script>

<div class="relative" use:clickOutside={() => (showGenerateOptions = false)}>
	<Button
		onclick={() => (showGenerateOptions = !showGenerateOptions)}
		title="Generate"
		classNames="text-yellow-400"
	>
		<Sparkle class="h-5 w-5 transition" />
	</Button>
	{#if showGenerateOptions}
		<div
			class="absolute right-0 top-10 z-20 w-max rounded border bg-white p-3"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => {
				if (e.key === 'Escape') {
					showGenerateOptions = false;
				}
			}}
			role="button"
			tabindex="0"
			transition:fade={{ duration: 100 }}
		>
			<input
				placeholder="Describe the new data."
				bind:value={generationInstruction}
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						showGenerateOptions = false;
						createInstances(generationInstruction, generationCount);
					}
				}}
				class="mb-2 w-full"
				type="text"
			/>
			<div class="flex items-center gap-2">
				<input bind:value={generationCount} type="range" min="1" max="10" />
				<Button
					classNames="shrink-0"
					onclick={() => {
						showGenerateOptions = false;
						createInstances(generationInstruction, generationCount);
					}}
				>
					Generate {generationCount} instances
				</Button>
			</div>
		</div>
	{/if}
</div>
