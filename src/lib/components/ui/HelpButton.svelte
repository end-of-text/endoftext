<script lang="ts">
	import { clickOutside } from '$lib/clickOutside';
	import { Bug, HelpCircle, Mail } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let showOptions = $state(false);
</script>

<div class="relative" use:clickOutside={() => (showOptions = false)}>
	<button
		class="flex cursor-pointer items-center justify-center transition"
		onclick={() => (showOptions = !showOptions)}
	>
		<HelpCircle class="h-5 w-5 transition-all  hover:text-primary" />
	</button>

	{#if showOptions}
		<div
			class="absolute right-0 top-6 z-50 rounded border border-gray-300 bg-white"
			transition:fade={{ duration: 100 }}
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => {
				if (e.key === 'Escape') {
					showOptions = false;
				}
			}}
			role="button"
			tabindex="0"
		>
			<div class="flex flex-col gap-2 p-2">
				<button
					class="mx-2 flex cursor-pointer items-center gap-2 text-gray-500 transition-all hover:text-black"
					onclick={() => {
						window.open('https://github.com/end-of-text/endoftext/issues', '_blank');
						showOptions = false;
					}}
				>
					<Bug class="h-5 w-5" />
					<span class="whitespace-nowrap text-sm">Report an Issue</span>
				</button>
				<button
					class="mx-2 flex cursor-pointer items-center gap-2 text-gray-500 transition-all hover:text-black"
					onclick={() => {
						location.href = 'mailto:help@endoftext.app';
						showOptions = false;
					}}
				>
					<Mail class="h-5 w-5" />
					<span class="whitespace-nowrap text-sm">Ask a Question</span>
				</button>
			</div>
		</div>
	{/if}
</div>
