<script lang="ts">
	let { children } = $props();
</script>

<div class="flex h-full min-h-0 w-full grow flex-col items-center justify-center">
	{@render children()}
</div>
