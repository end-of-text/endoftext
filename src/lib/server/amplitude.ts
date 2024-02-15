import { dev } from '$app/environment';
import { track } from '@amplitude/analytics-node';

export function trackEvent(
	name: string,
	eventProperties: Record<string, unknown> | undefined,
	eventOptions: Record<string, unknown>
) {
	if (!dev) {
		track(name, eventProperties, eventOptions);
	}
}
