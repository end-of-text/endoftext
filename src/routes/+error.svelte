<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex h-screen w-full flex-col items-center justify-center gap-5">
	<img src="/logo-small.svg" alt="Logo" class="h-6" />
	<h1>{$page.status}</h1>
	<p>{$page.error?.message}</p>
</div>
