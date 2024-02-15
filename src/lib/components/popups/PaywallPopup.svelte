<script lang="ts">
	import Popup from './Popup.svelte';

	let { message, onclose } = $props<{ message: string; onclose: () => void }>();

	function submit(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onclose();
		}
	}
</script>

<svelte:window onkeydown={submit} />

<Popup {onclose} classNames="w-1/2">
	<div class="flex w-full flex-col justify-center p-2">Paywall</div>
</Popup>
