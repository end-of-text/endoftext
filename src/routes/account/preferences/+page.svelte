<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { SubmitFunction } from '@sveltejs/kit';

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
	<p>Hello {$page.data.session?.user.email}</p>
	<br />
	<form method="post" action="?/signout" use:enhance={handleSignOut}>
		<button class="btn" disabled={loading}>Sign Out</button>
	</form>
</div>
