<script lang="ts">
	import { browser } from '$app/environment';
	import { clickOutside } from '$lib/clickOutside';
	import { tooltip } from '$lib/tooltip.svelte';
	import { Bug, HelpCircle, Mail } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let showOptions = $state(false);
</script>

<div class="relative">
	<button
		class="flex cursor-pointer items-center justify-center transition"
		use:tooltip={{ text: 'Get help with endoftext.' }}
		on:click={() => (showOptions = !showOptions)}
	>
		<HelpCircle class="h-5 w-5 text-black transition-all  hover:text-blue-500" />
	</button>

	{#if showOptions}
		<div
			class="absolute right-0 top-6 z-50 rounded border border-gray-300 bg-white"
			transition:fade={{ duration: 100 }}
			use:clickOutside={() => (showOptions = !showOptions)}
			on:click={(e) => e.stopPropagation()}
			on:keydown={(e) => {
				if (e.key === 'Escape') {
					showOptions = false;
				}
			}}
			role="button"
			tabindex="0"
		>
			<div style="padding: 7px 0px 7px 0px;">
				<button
					class="mx-2 flex cursor-pointer items-center gap-2 text-gray-400 transition-all hover:text-black"
					on:keydown={() => ({})}
					on:click={(e) => {
						e.stopPropagation();
						if (browser) window.open('https://github.com/end-of-text/endoftext/issues', '_blank');
						showOptions = false;
					}}
				>
					<Bug class="h-5 w-5" />
					<span class="whitespace-nowrap text-sm">Report an Issue</span>
				</button>
				<button
					class="mx-2 flex cursor-pointer items-center gap-2 text-gray-400 transition-all hover:text-black"
					on:keydown={() => ({})}
					on:click={(e) => {
						e.stopPropagation();
						if (browser) location.href = 'mailto:hello@zenoml.com';
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
