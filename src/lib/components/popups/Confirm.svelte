<script lang="ts">
	import { fade } from 'svelte/transition';
	import Button from '../ui/Button.svelte';

	const { message, confirmText, cancelText, confirm, cancel } = $props<{
		message: string;
		confirmText: string;
		cancelText: string;
		confirm: () => void;
		cancel: () => void;
	}>();
</script>

<div
	class="fixed inset-0 z-20 flex items-baseline justify-center bg-gray-200 bg-opacity-60 p-12"
	transition:fade={{ duration: 200 }}
>
	<div class="flex flex-col rounded border bg-white p-6 shadow">
		<div>
			<div class="mb-4">{message}</div>
			<slot />
			<div class="m-auto flex justify-end">
				<Button classNames="mr-4" onclick={cancel}>
					{cancelText}
				</Button>
				<Button onclick={confirm}>
					{confirmText}
				</Button>
			</div>
		</div>
	</div>
</div>
