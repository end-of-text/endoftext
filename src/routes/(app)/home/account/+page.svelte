<script lang="ts">
	import { enhance } from '$app/forms';
	import { regenerateAPIKey } from '$lib/api.js';
	import Button from '$lib/components/ui/Button.svelte';
	import { tooltip } from '$lib/tooltip.svelte.js';
	import * as amplitude from '@amplitude/analytics-browser';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Check, Copy, LogOut, RefreshCw } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	const { data } = $props();

	let loading = $state(false);
	let keyCopied = $state(false);
	// API keys implemented following https://github.com/orgs/supabase/discussions/4419
	let key = $state<string | undefined>(data.user.key);

	const handleSignOut: SubmitFunction = () => {
		loading = true;
		amplitude.setUserId(undefined);

		return async ({ update }) => {
			loading = false;
			update();
		};
	};

	async function regenerateKey() {
		key = await regenerateAPIKey();
	}

	function copyKey() {
		keyCopied = true;
		navigator.clipboard.writeText(key ?? '');
		setTimeout(() => {
			keyCopied = false;
		}, 3000);
	}
</script>

<div class="mt-2 flex flex-col gap-8">
	<div class="flex flex-col gap-2">
		<p>
			You are signed in as <span class="ml-2 rounded-full bg-gray-100 px-3 py-1">
				{data.user.email}
			</span>
		</p>
	</div>
	<div>
		<h2 class="mb-2">API Key</h2>
		<div class="flex items-center gap-2">
			{#if key}
				<p class="w-96 rounded bg-gray-100 px-3 py-1">
					{key}
				</p>
				<button onclick={copyKey} class="text-gray-active">
					{#if keyCopied}
						<span class="flex items-center gap-2 text-emerald-600" in:fade>
							<Check class="h-5 w-5" />
						</span>
					{:else}
						<span class="group flex items-center gap-2 hover:text-gray-hovered" in:fade>
							<Copy class="h-5 w-5" />
						</span>
					{/if}
				</button>
				<button
					onclick={regenerateKey}
					class="text-gray-active"
					use:tooltip={{
						text: 'You can only have one API key at a time. Make sure to use your new one after refreshing.'
					}}
				>
					<RefreshCw
						class="h-5 w-5 transition-all duration-500 hover:rotate-180 hover:text-gray-hovered"
					/>
				</button>
			{:else}
				<Button onclick={regenerateKey}>Generate API Key</Button>
			{/if}
		</div>
	</div>
	<div class="flex flex-col gap-2">
		<h2>Subscription</h2>
		{#if data.user.status === 'active'}
			<p>
				You are currently on the <span class="font-bold text-primary">plus</span> plan
			</p>
			<form method="post" action="?/manage" use:enhance>
				<input type="hidden" name="stripeId" value={data.user.stripeId} />
				<Button>Manage your Subscription</Button>
			</form>
		{:else}
			<p class="py-2">
				You are currently on the <span class="font-bold text-primary">free</span> plan
			</p>
			<form method="post" action="?/subscribe" use:enhance>
				<Button>Upgrade to Plus</Button>
			</form>
		{/if}
	</div>
	<div class="flex flex-col gap-2">
		<form method="post" action="?/signout" use:enhance={handleSignOut}>
			<Button disabled={loading} title="Sign Out">
				<LogOut class="h-5 w-5" />
			</Button>
		</form>
	</div>
</div>
