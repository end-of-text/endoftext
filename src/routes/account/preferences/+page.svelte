<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { SubmitFunction } from '@sveltejs/kit';

	let loading = false;
	let fullName: string = $page.data.profile?.full_name ?? '';
	let username: string = $page.data.profile?.username ?? '';
	let website: string = $page.data.profile?.website ?? '';

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async () => {
			loading = false;
		};
	};

	const handleSignOut: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	};
</script>

<div class="form-widget">
	<form class="form-widget" method="post" action="?/update" use:enhance={handleSubmit}>
		<div>
			<label for="email">Email</label>
			<input id="email" type="text" value={$page.data.session?.user.email} disabled />
		</div>

		<div>
			<label for="fullName">Full Name</label>
			<input id="fullName" name="fullName" type="text" value={fullName} />
		</div>

		<div>
			<label for="username">Username</label>
			<input id="username" name="username" type="text" value={username} />
		</div>

		<div>
			<label for="website">Website</label>
			<input id="website" name="website" type="url" value={website} />
		</div>

		<input type="submit" value={loading ? 'Loading...' : 'Update'} disabled={loading} />
	</form>

	<form method="post" action="?/signout" use:enhance={handleSignOut}>
		<button class="button block" disabled={loading}>Sign Out</button>
	</form>
</div>
