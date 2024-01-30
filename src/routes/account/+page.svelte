<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';

	const { form } = $props();

	let formType = $state('login');
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<h1>log in or sign up</h1>

<div class="w-40 h-1/2">
	<div class="flex w-full mb-2">
		<button
			class="w-1/2 text-center py-2 bg-slate-50 hover:bg-slate-100 border-r cursor-default {formType ===
			'login'
				? 'bg-slate-200 hover:bg-slate-300'
				: ''}"
			on:click={() => (formType = 'login')}
			on:keydown={(event) => {
				if (event.key === 'Enter') formType = 'login';
			}}
		>
			Sign in
		</button>
		<button
			class="w-1/2 text-center py-2 bg-slate-50 hover:bg-slate-100 cursor-default {formType ===
			'signup'
				? 'bg-slate-200 hover:bg-slate-300'
				: ''}"
			on:click={() => (formType = 'signup')}
		>
			Sign up
		</button>
	</div>
	{#if formType === 'login'}
		<form class="flex flex-col gap-2" method="post" action="?/login" use:enhance>
			<input name="email" placeholder="email" value={form?.email ?? ''} />
			<input type="password" name="password" placeholder="password" />
			<button>Sign in</button>
		</form>
	{:else}
		<form class="flex flex-col gap-2" method="post" action="?/signup" use:enhance>
			<input name="email" placeholder="email" value={form?.email ?? ''} />
			<input type="password" name="password" placeholder="password" />
			<button>Sign up</button>
		</form>
	{/if}
	{#if form?.success}
		<p>check email for confirmation.</p>
	{/if}
</div>
