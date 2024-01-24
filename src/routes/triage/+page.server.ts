import { getEntries } from '$lib/server/db';

export function load({ cookies }) {
	let id = cookies.get('userid');

	if (!id) {
		id = crypto.randomUUID();
		cookies.set('userid', id, { path: '/' });
	}

	const entries = getEntries(id) || [];

	return {
		entries
	};
}
