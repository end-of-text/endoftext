<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';

	const { form } = $props();

	let formType = $state('login');
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<div class="mx-auto my-auto h-1/2 w-60">
	<h1>log in or sign up</h1>
	<div class="my-2 flex w-full">
		<button
			class="w-1/2 cursor-default rounded-bl rounded-tl border border-r py-2 text-center {formType ===
			'login'
				? 'bg-gray-200 hover:bg-gray-300'
				: 'bg-gray-50 hover:bg-gray-100'}"
			onclick={() => (formType = 'login')}
			onkeydown={(event) => {
				if (event.key === 'Enter') formType = 'login';
			}}
		>
			Sign in
		</button>
		<button
			class="w-1/2 cursor-default rounded-br rounded-tr border py-2 text-center {formType ===
			'signup'
				? 'bg-gray-200 hover:bg-gray-300'
				: 'bg-gray-50 hover:bg-gray-100'}"
			onclick={() => (formType = 'signup')}
		>
			Sign up
		</button>
	</div>
	{#if formType === 'login'}
		<form class="flex flex-col gap-2" method="post" action="?/login" use:enhance>
			<input name="email" placeholder="email" value={form?.email ?? ''} />
			<input class="mb-4" type="password" name="password" placeholder="password" />
			<Button classNames="ml-auto" fancy>Sign in</Button>
		</form>
	{:else}
		<form class="flex flex-col gap-2" method="post" action="?/signup" use:enhance>
			<input name="email" placeholder="email" value={form?.email ?? ''} />
			<input class="mb-4" type="password" name="password" placeholder="password" />
			<Button classNames="ml-auto" fancy>Sign up</Button>
		</form>
	{/if}
	{#if form?.success}
		<p>check email for confirmation.</p>
	{:else if form?.error}
		<p>{form?.error}</p>
	{/if}
</div>
