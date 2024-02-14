<script lang="ts">
	import { page } from '$app/stores';
	import HelpButton from '$lib/components/ui/HelpButton.svelte';
	import { Home, User2 } from 'lucide-svelte';

	const { children } = $props();
</script>

<div class="mx-auto mt-10 flex min-h-0 w-full max-w-4xl grow gap-2">
	<div class="flex w-1/6 flex-col">
		<a href="/home" class="my-3 ml-3 mr-2">
			<img src="/logo.svg" alt="logo" />
		</a>
		<a
			class="flex gap-2 rounded p-2 text-gray-500 transition-all hover:text-gray-900 {$page.url
				.pathname === '/home'
				? 'text-gray-900'
				: ''}"
			href="/home"
		>
			<Home class="h-5 w-5" />
			All Prompts
		</a>
		<a
			class="flex gap-2 rounded p-2 text-gray-500 transition-all hover:text-gray-900 {$page.url
				.pathname === '/home/account'
				? 'text-gray-900'
				: ''}"
			href="/home/account"
		>
			<User2 class="h-5 w-5" />
			Account
		</a>
		<div class="ml-2 mt-2 flex items-center gap-2">
			<div
				class="text-primary pointer-events-none w-fit rounded-md bg-rose-50 px-4 py-1 text-sm font-bold"
			>
				Beta
			</div>
			<HelpButton />
		</div>
	</div>
	<div class="w-5/6 border-l pl-6">
		{@render children()}
	</div>
</div>
