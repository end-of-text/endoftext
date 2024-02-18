<script lang="ts">
	import { fade } from 'svelte/transition';
	import Button from '../ui/Button.svelte';

	const {
		message,
		confirmText,
		cancelText,
		confirm,
		cancel,
		confirmIsDelete = false
	} = $props<{
		message: string;
		confirmText: string;
		cancelText: string;
		confirm: () => void;
		cancel: () => void;
		confirmIsDelete?: boolean;
	}>();
</script>

<div
	class="fixed inset-0 z-20 flex items-baseline justify-center bg-gray-200 bg-opacity-60 p-12"
	transition:fade={{ duration: 200 }}
	onclick={cancel}
	onkeydown={() => undefined}
	role="button"
	tabindex="0"
>
	<div class="flex flex-col rounded border bg-white p-6 shadow">
		<div>
			<div class="mb-4">{message}</div>
			<slot />
			<div class="m-auto flex justify-end">
				<Button classNames="mr-4" onclick={cancel}>
					{cancelText}
				</Button>
				<Button
					onclick={confirm}
					classNames={confirmIsDelete
						? 'bg-red-100 border-red-200'
						: 'bg-green-100 border-green-200'}
				>
					{confirmText}
				</Button>
			</div>
		</div>
	</div>
</div>
