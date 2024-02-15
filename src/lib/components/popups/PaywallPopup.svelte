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

<Popup {onclose} classNames="w-1/2 py-10 flex flex-col gap-5 items-center justify-center min-w-60">
	<p class="text-xl font-medium text-gray-700">{message}</p>
	<a
		href="/home/account"
		class="rounded border border-primary bg-rose-50 px-4 py-2 font-bold text-primary transition-colors hover:bg-rose-100"
	>
		Upgrade to Plus
	</a>

	<h2 class="mt-2 text-primary">Plus</h2>
	<ol class="list-disc text-left">
		<li>Unlimited test cases</li>
		<li>Unlimited prompts</li>
		<li>GPT 4 & 4.5</li>
	</ol>
</Popup>
