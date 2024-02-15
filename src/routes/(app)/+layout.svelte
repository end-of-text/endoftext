<script lang="ts">
	import * as amplitude from '@amplitude/analytics-browser';

	let { children, data } = $props();
	amplitude.setUserId(data.user.id);
</script>

{@render children()}
