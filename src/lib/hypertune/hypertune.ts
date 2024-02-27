import { PUBLIC_HYPERTUNE_TOKEN } from '$env/static/public';
import { initializeHypertune } from './generated';

const hypertune = initializeHypertune({}, { token: PUBLIC_HYPERTUNE_TOKEN });

export async function getHypertuneRoot(user: { id: string; email?: string }) {
	await hypertune.initFromServerIfNeeded();

	return hypertune.root({
		context: {
			environment: 'PRODUCTION',
			user: {
				id: user.id,
				name: user.id,
				email: user.email ?? ''
			}
		}
	});
}
