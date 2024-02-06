<script lang="ts">
	import { page } from '$app/stores';
	import type { Session } from '@supabase/supabase-js';
	import { Home, User2 } from 'lucide-svelte';

	let { session } = $props<{ session: Session | null }>();
</script>

<div class="flex h-full flex-col gap-2 border-r p-2 pt-4">
	{#if session}
		<a
			href="/home"
			class="rounded-full px-1 py-2 transition hover:bg-slate-100 {$page.url.pathname === '/home'
				? 'text-purple-600'
				: ''}"
		>
			<Home />
		</a>
		<a
			href="/account/preferences"
			class="rounded-full px-1 py-2 transition hover:bg-slate-100 {$page.url.pathname ===
			'/account/preferences'
				? 'text-purple-600'
				: ''}"
		>
			<User2 />
		</a>
	{/if}
</div>
