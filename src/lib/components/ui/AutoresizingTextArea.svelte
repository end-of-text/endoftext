<script lang="ts">
	import type { FocusEventHandler, KeyboardEventHandler } from 'svelte/elements';

	let {
		value,
		minRows,
		maxRows,
		classNames = '',
		onblur = () => {},
		onkeydown = () => {}
	} = $props<{
		value: string;
		minRows: number;
		maxRows: number;
		classNames: string;
		onblur?: FocusEventHandler<HTMLTextAreaElement>;
		onkeydown?: KeyboardEventHandler<HTMLTextAreaElement>;
	}>();

	let minHeight = $derived(`${1 + minRows * 1.2}em`);
	let maxHeight = $derived(maxRows ? `${1 + maxRows * 1.2}em` : `auto`);
</script>

<div class="{classNames} relative">
	<pre aria-hidden="true" class="min-h[{minHeight}] max-h-[{maxHeight}] box-border overflow-hidden">
    {value + '\n'}
  </pre>
	<textarea
		{onblur}
		{onkeydown}
		bind:value
		class="absolute top-0 box-border h-full resize-none overflow-hidden"
	/>
</div>
