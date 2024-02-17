<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { Trash2 } from 'lucide-svelte';

	let { data } = $props();

	let instances = $state<string[]>(data.instances || []);
	let submitted = $state(false);

	data.generatedInstances?.then((res) => {
		try {
			const parsedJSON = JSON.parse(res || '');
			instances = parsedJSON.instances;
		} catch (e) {
			instances = ['Example input 1', 'Example input 2', 'Example input 3'];
		}
	});
</script>

<div class="flex h-full flex-col items-center justify-center">
	<form
		class="flex flex-col items-start gap-2"
		method="POST"
		use:enhance={() => {
			submitted = true;
			return async ({ update }) => {
				update();
			};
		}}
	>
		<div class="flex w-full items-center justify-between">
			<p class="mb-2 text-gray-500">2 / 2</p>
			<img src="/logo.svg" alt="logo" class="h-4" />
		</div>
		<h1>Example Inputs</h1>
		<div class="mb-2 flex flex-col gap-2">
			<p>To improve your prompt we'll need some example inputs</p>
			<p>These are the questions or statements you want your model to respond to.</p>
		</div>
		<div class="flex w-full flex-col gap-2">
			{#if data.generatedInstances && instances.length === 0}
				<p class="mb-2 italic text-gray-600">Generating instances...</p>
			{/if}
			{#each instances as instance, i}
				<div class="flex items-center gap-2">
					<textarea
						name="instance"
						class="w-full"
						placeholder="Enter text here"
						value={instance}
						onblur={() => (instances[i] = instance)}
					/>
					<Trash2
						class="h-5 w-5 cursor-pointer transition-all hover:text-red-600"
						onclick={() => instances?.splice(i, 1)}
					/>
				</div>
			{/each}
		</div>
		<div class="flex gap-2">
			<Button
				classNames="my-2"
				onclick={(e) => {
					e.preventDefault();
					instances?.push('');
				}}
			>
				Add
			</Button>
			<Button
				classNames="my-2"
				onclick={(e) => {
					e.preventDefault();
					instances?.push('');
				}}
			>
				Generate
			</Button>
		</div>
		<div class="ml-auto flex items-center gap-2">
			{#if submitted}
			<Spinner />
			{/if}
			<Button
				onclick={(e) => {
					e.preventDefault();
					goto('./prompt');
				}}>Back</Button
			>
			<Button>Next</Button>
		</div>
	</form>
</div>
