<script lang="ts">
	import { page } from '$app/stores';
	import { Home, User2 } from 'lucide-svelte';

	const { children } = $props();
</script>

<div class="mx-auto mt-10 flex min-h-0 w-full max-w-4xl grow gap-2">
	<div class="flex w-1/6 flex-col gap-4">
		<a
			class="flex gap-2 rounded p-2 transition hover:bg-slate-200 {$page.url.pathname === '/home'
				? 'bg-slate-100'
				: ''}"
			href="/home"
		>
			<Home />
			All Prompts
		</a>
		<a
			class="flex gap-2 rounded p-2 transition hover:bg-slate-200 {$page.url.pathname ===
			'/home/account'
				? 'bg-slate-100'
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
