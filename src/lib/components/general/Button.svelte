<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		disabled = false,
		classNames = ''
	} = $props<{ children: Snippet; disabled?: boolean; classNames?: string }>();
</script>

<div class="group relative {classNames}">
	<div
		class="absolute -inset-1 rounded-lg {disabled
			? 'bg-gray-500'
			: 'bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 group-hover:opacity-100'} opacity-75 blur transition duration-500"
	></div>
	<button class="relative rounded-lg bg-white px-7 py-4 disabled:text-gray-500" on:click {disabled}>
		{@render children()}
	</button>
</div>
