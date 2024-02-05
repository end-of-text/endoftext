<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import { Trash2 } from 'lucide-svelte';
	import { get } from 'svelte/store';

	let instances = $state<string[]>();

	$effect(() => {
		if (instances === undefined) {
			const localInstances = localStorage.getItem('instances' + get(page).params.id);
			if (localInstances !== null) {
				instances = JSON.parse(localInstances);
			} else {
				instances = ['example 1', 'example 2', 'example 3'];
			}
		} else {
			localStorage.setItem('instances' + get(page).params.id, JSON.stringify(instances));
		}
	});
</script>

<div class="flex h-full flex-col items-center justify-center">
	<form class="flex flex-col items-start" method="POST" use:enhance>
		<p class="mb-2 text-slate-500">2 / 2</p>
		<div class="mb-5 flex w-full items-center justify-between">
			<h1>Example Inputs</h1>
			<div class="flex gap-2">
				<Button
					onclick={(e) => {
						e.preventDefault();
						goto('./prompt');
					}}>back</Button
				>
				<Button>next</Button>
			</div>
		</div>
		<div class="mb-4 flex flex-col gap-2">
			<p>To improve your prompt we'll need some example inputs</p>
			<p>These are the questions or statements you want your model to respond to.</p>
		</div>
		{#if instances}
			<div class="flex w-full flex-col gap-2">
				{#each instances as instance, i}
					<div class="flex items-center gap-2">
						<textarea
							name="instance"
							class="w-full"
							placeholder="Enter text here"
							bind:value={instance}
						/>
						<Trash2
							class="cursor-pointer hover:text-red-600"
							onclick={() => instances?.splice(i, 1)}
						/>
					</div>
				{/each}
			</div>
			<Button
				classNames="my-2 w-full"
				onclick={(e) => {
					e.preventDefault();
					instances?.push('');
				}}
			>
				Add More
			</Button>
		{/if}
	</form>
</div>
