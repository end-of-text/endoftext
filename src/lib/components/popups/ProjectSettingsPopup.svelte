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
	<div class="flex w-full flex-col justify-center p-2">
		<div class="flex flex-col items-start gap-2">
			<h1>Project Settings</h1>
			<h2 class="mt-4">Users</h2>
			{#await userRequest}
				<Spinner />
			{:then users}
				{#each users as user (user.id)}
					<div class="rounded-full bg-neutral-100 px-3 py-1">
						{user.email}
					</div>
				{/each}
			{/await}
		</div>
		<div class="mt-2 flex">
			<input class="py-1" placeholder="email" bind:value={newUser} />
			{#if addingUser}
				<Spinner />
			{:else}
				<Button classNames="self-end ml-2" disabled={newUser === ''} onclick={addUser}
					>Add User</Button
				>
			{/if}
		</div>
		<Button classNames="self-end" onclick={onclose}>Done</Button>
	</div>
</Popup>
