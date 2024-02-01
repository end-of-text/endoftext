<script lang="ts">
	import { updateInstance } from '$lib/api';
	import type { Instance } from '$lib/types';
	import type { EventHandler } from 'svelte/elements';
	import InstanceView from '../Instances/InstanceView.svelte';
	import Button from '../ui/Button.svelte';
	import Popup from './Popup.svelte';

	let { instance, onclose } = $props<{ instance: Instance; onclose: EventHandler<any> }>();

	let bindableInstance = $state(instance);

	function submit(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onclose(e);
		}
		if (e.key === 'Enter') {
			onclose(e);
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
			onclick={(e) => updateInstance(bindableInstance).then(() => onclose(e))}
		>
			Update
		</Button>
	</div>
</Popup>
