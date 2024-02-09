<script lang="ts">
	import { page } from '$app/stores';
	import { Home, User2 } from 'lucide-svelte';

	const { children } = $props();
</script>

<div class="mx-auto mt-10 flex min-h-0 w-full max-w-4xl grow gap-2">
	<div class="flex w-1/6 flex-col">
		<img class="mb-3 ml-3 mr-2 mt-3" src="/logo.svg" alt="logo" />
		<a
			class="flex gap-2 rounded p-2 text-gray-500 transition hover:text-gray-900 {$page.url
				.pathname === '/home'
				? 'text-gray-900'
				: ''}"
			href="/home"
		>
			<Home />
			All Prompts
		</a>
		<a
			class="flex gap-2 rounded p-2 text-gray-500 transition hover:text-gray-900 {$page.url
				.pathname === '/home/account'
				? 'text-gray-900'
				: ''}"
			href="/home/account"
		>
			<User2 />
			Account
		</a>
	</div>
	<div class="w-5/6 border-l pl-6">
		{@render children()}
	</div>
</div>
