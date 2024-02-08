<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	let {
		children,
		onclick = () => {},
		disabled = false,
		classNames = ''
	} = $props<{
		children: Snippet;
		onclick?: MouseEventHandler<HTMLButtonElement>;
		disabled?: boolean;
		classNames?: string;
	}>();
</script>

<button {disabled} {onclick} class={classNames}>
	{@render children()}
</button>
