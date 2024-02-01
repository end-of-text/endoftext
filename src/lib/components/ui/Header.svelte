<script lang="ts">
	import type { Session } from '@supabase/supabase-js';

	let { session } = $props<{ session: Session | null }>();
</script>

<div class="flex w-full gap-2 p-2 shadow">
	{#if session}
		<a href="/home">home</a>
		<a href="/account/preferences">account</a>
	{/if}
</div>
