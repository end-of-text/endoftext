import { getEntries, getSearchResults } from '$lib/server/db';

export function load({ cookies }) {
	let id = cookies.get('userid');

	if (!id) {
		id = crypto.randomUUID();
		cookies.set('userid', id, { path: '/' });
	}

	return {
		entries: getEntries(id) || [],
		searchResults: getSearchResults(id) || []
	};
}
