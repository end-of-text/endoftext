<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';

	const { form } = $props();

	let formType = $state('login');
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<h1>log in or sign up</h1>

<div class="h-1/2 w-40">
	<div class="mb-2 flex w-full">
		<button
			class="w-1/2 cursor-default border border-r py-2 text-center {formType === 'login'
				? 'bg-slate-200 hover:bg-slate-300'
				: 'bg-slate-50 hover:bg-slate-100'}"
			on:click={() => (formType = 'login')}
			on:keydown={(event) => {
				if (event.key === 'Enter') formType = 'login';
			}}
		>
			Sign in
		</button>
		<button
			class="w-1/2 cursor-default border py-2 text-center {formType === 'signup'
				? 'bg-slate-200 hover:bg-slate-300'
				: 'bg-slate-50 hover:bg-slate-100'}"
			on:click={() => (formType = 'signup')}
		>
			Sign up
		</button>
	</div>
	{#if formType === 'login'}
		<form class="flex flex-col gap-2" method="post" action="?/login" use:enhance>
			<input name="email" placeholder="email" value={form?.email ?? ''} />
			<input type="password" name="password" placeholder="password" />
			<Button fancy>Sign in</Button>
		</form>
	{:else}
		<form class="flex flex-col gap-2" method="post" action="?/signup" use:enhance>
			<input name="email" placeholder="email" value={form?.email ?? ''} />
			<input type="password" name="password" placeholder="password" />
			<Button fancy>Sign up</Button>
		</form>
	{/if}
	{#if form?.success}
		<p>check email for confirmation.</p>
	{:else if form?.error}
		<p>{form?.error}</p>
	{/if}
</div>
