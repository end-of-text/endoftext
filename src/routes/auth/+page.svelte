<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import { onMount } from 'svelte';

	const { form } = $props();

	let formType = $state('login');
	let redirect = $state('');

	onMount(() => {
		redirect = new URLSearchParams(location.search).get('redirect') ?? '';
	});
</script>

<svelte:head>
	<title>endoftext | Log in or sign up</title>
</svelte:head>

<div class="mx-auto my-auto h-1/2 w-60">
	<img class="mb-10 w-full" src="/logo.svg" alt="logo" />
	<form method="post" action="?/loginWithOauth" use:enhance>
		<button
			class="my-2 flex w-full items-center rounded border py-2 text-center transition-all hover:shadow"
			name="provider"
			value="google"
		>
			<svg class="ml-2 h-6 w-6" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<title>Google</title>
				<path
					d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
				/>
			</svg>
			<p class="w-full">Sign in with Google</p>
		</button>
		<button
			class="my-2 flex w-full items-center rounded border py-2 text-center transition-all hover:shadow"
			name="provider"
			value="github"
		>
			<svg class="ml-2 h-6 w-6" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<title>GitHub</title>
				<path
					d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
				/>
			</svg>
			<p class="w-full">Sign in with GitHub</p>
		</button>
	</form>
	<p class="mb-4 mt-2 text-center italic">or</p>
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
			<input type="hidden" name="redirect" value={redirect} />
			<input name="email" placeholder="email" value={form?.email ?? ''} />
			<input class="mb-2" type="password" name="password" placeholder="password" />
			<Button classNames="ml-auto">Sign in</Button>
		</form>
	{:else}
		<form class="flex flex-col gap-2" method="post" action="?/signup" use:enhance>
			<input name="email" placeholder="email" value={form?.email ?? ''} />
			<input class="mb-2" type="password" name="password" placeholder="password" />
			<Button classNames="ml-auto">Sign up</Button>
		</form>
	{/if}
	{#if form?.success}
		<p class="my-2">Check email for confirmation.</p>
	{:else if form?.error}
		<p class="my-2">{form?.error}</p>
	{/if}
	<p class="mt-6 text-center text-sm italic text-gray-500">
		By signing up you agree to our <br /><a href="/tos" class="text-gray-600 hover:text-gray-600"
			>terms of service</a
		>
	</p>
</div>
