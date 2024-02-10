<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { LogOut } from 'lucide-svelte';

	const { data } = $props();

	let loading = $state(false);

	const handleSignOut: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	};
</script>

<div class="mt-2">
	<p>
		You are signed in as <span class="ml-2 rounded-full bg-gray-100 px-3 py-1">
			{data.session?.user.email}
		</span>
	</p>
	<br />
	<form method="post" action="?/signout" use:enhance={handleSignOut}>
		<Button disabled={loading} title="Sign Out">
			<LogOut class="h-5 w-5" />
		</Button>
	</form>
</div>
