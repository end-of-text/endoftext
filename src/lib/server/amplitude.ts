import { dev } from '$app/environment';
import { track } from '@amplitude/analytics-node';

export function trackEvent(
	name: string,
	eventOptions: Record<string, unknown>,
	eventProperties?: Record<string, unknown>
) {
	if (!dev) {
		track(name, eventProperties, eventOptions);
	}
}
