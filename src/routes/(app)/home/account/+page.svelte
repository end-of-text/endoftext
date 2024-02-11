<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import * as amplitude from '@amplitude/analytics-browser';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { LogOut } from 'lucide-svelte';

	const { data } = $props();

	let loading = $state(false);

	const handleSignOut: SubmitFunction = () => {
		loading = true;
		amplitude.setUserId(undefined);

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
	<h2>Subscription</h2>
	{#if data.subscription.status === 'active'}
		<p class="py-2">You are currently on the <span class="text-blue-600">plus</span> plan</p>
		<form method="post" action="?/manage" use:enhance>
			<input type="hidden" name="stripeId" value={data.subscription.stripe_id} />
			<Button>Manage your Subscription</Button>
		</form>
	{:else}
		<p class="py-2">You are currently on the <span class="text-blue-600">free</span> plan</p>
		<form method="post" action="?/subscribe" use:enhance>
			<Button>Upgrade to Plus</Button>
		</form>
	{/if}
	<br />
	<form method="post" action="?/signout" use:enhance={handleSignOut}>
		<Button disabled={loading} title="Sign Out">
			<LogOut class="h-5 w-5" />
		</Button>
	</form>
</div>
