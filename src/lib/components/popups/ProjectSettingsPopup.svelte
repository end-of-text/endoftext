<script lang="ts">
	import {
		addProjectUser,
		changeProjectMetric,
		getProjectUsers,
		removeProjectUser,
		toggleProjectLabels
	} from '$lib/api';
	import Button from '$lib/components/ui/Button.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import type { Tables } from '$lib/supabase';
	import { metrics } from '$lib/types';
	import { Check, Copy, X } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import Popup from './Popup.svelte';

	let { project, onclose, prompt } = $props<{
		project: Tables<'projects'>;
		onclose: () => void;
		prompt: Tables<'prompts'>;
	}>();

	let newUser = $state('');
	let localProjectName = $state(project.name);
	let addingUser = $state(false);
	let userRequest = $state(getProjectUsers(project.id || ''));
	let copied = $state(false);

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

	function copyToClipboard() {
		// debounce set copied to false
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
		navigator.clipboard.writeText(
			`https://app.endoftext.app/api/serve/project/${project.id}/prompt/${prompt.id}`
		);
	}
</script>

<svelte:window onkeydown={submit} />

<Popup {onclose} classNames="w-1/2">
	<div class="flex w-full flex-col justify-center p-2 text-left">
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
								<X class="h-5 w-5 cursor-pointer transition-all hover:text-red-600" />
							</button>
						{/if}
					</div>
				{/each}
			{/await}
			<div class="mt-2 flex items-center">
				<input class="py-1" placeholder="email" bind:value={newUser} />
				{#if addingUser}
					<div class="pl-2">
						<Spinner />
					</div>
				{:else}
					<Button classNames="self-end ml-2" disabled={newUser === ''} onclick={addUser}>
						Add User
					</Button>
				{/if}
			</div>
			<h2 class="mt-4">Labels and Metrics</h2>
			<div class="flex flex-col gap-2">
				<label
					class="flex flex-row items-center"
					onchange={async () => {
						const projectRes = await toggleProjectLabels(
							project.id,
							prompt,
							project.show_labels,
							project.metric_name
						);
						project.metric_name = projectRes.metric_name;
					}}
				>
					<input type="checkbox" class="mr-2" bind:checked={project.show_labels} />
					<span>Show Labels</span>
				</label>
				<div class="flex flex-row items-center">
					<span class="mr-2">Metric</span>
					<Select
						bind:value={project.metric_name}
						onchange={() => changeProjectMetric(project.id, project.metric_name)}
						options={[
							{ value: null, label: 'none' },
							...metrics.map((m) => {
								return { value: m, label: m };
							})
						]}
					/>
				</div>
			</div>
			<h2 class="mt-4">Endpoint</h2>
			<p>Fetch your prompt to use it programmatically.</p>
			<div class="flex gap-2 rounded-full bg-gray-100 px-3 py-1">
				{`https://app.endoftext.app/api/serve/project/${project.id}/prompt/${prompt.id}`}
				{#if !copied}
					<button
						class="cursor-pointer text-gray-active hover:text-gray-hovered"
						onclick={() => copyToClipboard()}
						in:fade
					>
						<Copy />
					</button>
				{:else}
					<div in:fade>
						<Check class="text-emerald-600" />
					</div>
				{/if}
			</div>
		</div>
		<p class="pt-2 text-sm">
			Use the header <code>x-api-key</code> with your API key. You can find your API key in your
			<a
				href="/home/account"
				class="underline transition hover:text-primary hover:decoration-primary">account settings</a
			>.
		</p>
		<Button classNames="self-end" onclick={onclose}>Done</Button>
	</div>
</Popup>
