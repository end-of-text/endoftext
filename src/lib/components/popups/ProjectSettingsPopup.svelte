<script lang="ts">
	import { addProjectUser, getProjectUsers } from '$lib/api';
	import type { Tables } from '$lib/supabase';
	import Button from '../ui/Button.svelte';
	import Spinner from '../ui/Spinner.svelte';
	import Popup from './Popup.svelte';

	let { project, onclose } = $props<{ project: Tables<'projects'>; onclose: () => void }>();

	let newUser = $state('');
	let addingUser = $state(false);
	let userRequest = $state(getProjectUsers(project.id || ''));

	function submit(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onclose();
		}
		if (e.key === 'Enter') {
			onclose();
		}
	}

	async function addUser() {
		const email = newUser;
		newUser = '';
		addingUser = true;
		await addProjectUser(project.id, email);
		userRequest = getProjectUsers(project.id || '');
		addingUser = false;
	}
</script>

<svelte:window onkeydown={submit} />

<Popup {onclose} classNames="w-1/2">
	<div class="flex w-full flex-col justify-center">
		<div class="m-2 flex flex-col items-start gap-2">
			<h2>Users</h2>
			{#await userRequest}
				<Spinner />
			{:then users}
				{#each users as user (user.id)}
					<div>
						{user.email}
					</div>
				{/each}
			{/await}
		</div>
		<div class="flex">
			<input placeholder="email" bind:value={newUser} />
			{#if addingUser}
				<Spinner />
			{:else}
				<Button classNames="m-2 self-end" disabled={newUser === ''} onclick={addUser}
					>Add User</Button
				>
			{/if}
		</div>
		<Button classNames="m-2 self-end" onclick={onclose}>Done</Button>
	</div>
</Popup>
