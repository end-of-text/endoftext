<script lang="ts">
	import { updateInstance } from '$lib/api';
	import type { Tables } from '$lib/supabase';
	import InstanceView from '../Instances/InstanceView.svelte';
	import Button from '../ui/Button.svelte';
	import Popup from './Popup.svelte';

	let { instance, onclose } = $props<{ instance: Tables<'instances'>; onclose: () => void }>();

	let bindableInstance = $state(instance);

	function submit(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onclose();
		}
		if (e.key === 'Enter') {
			onclose();
		}
	}
</script>

<svelte:window onkeydown={submit} />

<Popup {onclose} classNames="w-1/2">
	<div class="flex w-full flex-col">
		<div class="m-2">
			<InstanceView bind:instance={bindableInstance} edit />
		</div>
		<Button
			classNames="m-2 self-end"
			onclick={() => updateInstance(bindableInstance).then(() => onclose())}
		>
			Update
		</Button>
	</div>
</Popup>
