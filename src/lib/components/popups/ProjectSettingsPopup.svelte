<script lang="ts">
	import { addProjectUser, getProjectUsers, removeProjectUser } from '$lib/api';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Tables } from '$lib/supabase';
	import { X } from 'lucide-svelte';
	import Popup from './Popup.svelte';

	let { project, onclose } = $props<{ project: Tables<'projects'>; onclose: () => void }>();

	let newUser = $state('');
	let localProjectName = $state(project.name);
	let addingUser = $state(false);
	let userRequest = $state(getProjectUsers(project.id || ''));

	function submit(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onclose();
		}
		if (e.key === 'Enter') {
			if (newUser !== '') {
				addUser();
			}
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

	async function removeUser(userId: string) {
		await removeProjectUser(project.id, userId);
		userRequest = getProjectUsers(project.id || '');
	}
</script>

<svelte:window onkeydown={submit} />

<Popup {onclose} classNames="w-1/2">
	<div class="flex w-full flex-col justify-center p-2">
		<div class="flex flex-col items-start gap-2">
			<h1>Project Settings</h1>
			<h2 class="mt-4">Project Name</h2>
			<form class="flex items-center" method="post" action="?/updateName">
				<input bind:value={localProjectName} class="mr-2 w-64 py-1" type="text" name="name" />
				<Button
					classNames="self-end"
					disabled={localProjectName.length === 0 || localProjectName === project.name}
				>
					Update Name
				</Button>
			</form>
			<h2 class="mt-4">Users</h2>
			{#await userRequest}
				<Spinner />
			{:then users}
				{#each users as user, index (user.id)}
					<div class="flex gap-2 rounded-full bg-gray-100 px-3 py-1">
						{user.email}
						{#if index > 0}
							<button onclick={() => removeUser(user.id)}>
								<X class="cursor-pointer transition hover:text-red-600" />
							</button>
						{/if}
					</div>
				{/each}
			{/await}
		</div>
		<div class="mt-2 flex items-center">
			<input class="py-1" placeholder="email" bind:value={newUser} />
			{#if addingUser}
				<Spinner classNames="pl-2" />
			{:else}
				<Button classNames="self-end ml-2" disabled={newUser === ''} onclick={addUser}>
					Add User
				</Button>
			{/if}
		</div>
		<Button classNames="self-end" onclick={onclose}>Done</Button>
	</div>
</Popup>
