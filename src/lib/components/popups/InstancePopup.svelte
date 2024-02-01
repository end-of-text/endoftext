<script lang="ts">
	import { updateInstance } from '$lib/api';
	import type { Instance } from '$lib/types';
	import { createEventDispatcher } from 'svelte';
	import InstanceView from '../Instances/InstanceView.svelte';
	import Button from '../ui/Button.svelte';
	import Popup from './Popup.svelte';

	let { instance } = $props<{ instance: Instance }>();

	let bindableInstance = $state(instance);

	const dispatch = createEventDispatcher();

	function submit(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			dispatch('close');
		}
		if (e.key === 'Enter') {
			updateInstance(bindableInstance).then(() => dispatch('close'));
		}
	}
</script>

<svelte:window on:keydown={submit} />

<Popup on:close classNames="w-1/2">
	<div class="flex w-full flex-col">
		<div class="m-2">
			<InstanceView bind:instance={bindableInstance} edit />
		</div>
		<Button
			classNames="m-2 self-end"
			on:click={() => updateInstance(bindableInstance).then(() => dispatch('close'))}
		>
			Update
		</Button>
	</div>
</Popup>
