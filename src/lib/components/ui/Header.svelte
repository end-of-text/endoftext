<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import Home from '../icons/Home.svelte';
	import Person from '../icons/Person.svelte';

	let { session } = $props<{ session: Session | null }>();
</script>

<div class="flex h-full flex-col gap-2 p-2 shadow">
	{#if session}
		<a class="px-1 py-2 transition hover:text-slate-400" href="/home"><Home /></a>
		<a class="px-1 py-2 transition hover:text-slate-400" href="/account"><Person /></a>
	{/if}
</div>
