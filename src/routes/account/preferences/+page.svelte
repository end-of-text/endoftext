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

<div class="form-widget">
	<p>Hello {data.session?.user.email}</p>
	<br />
	<form method="post" action="?/signout" use:enhance={handleSignOut}>
		<Button disabled={loading}><LogOut /> Sign Out</Button>
	</form>
</div>
