import { createEntries } from '$lib/server/db';

export async function POST({ cookies, request }) {
	const id = cookies.get('userid');
	if (!id) {
		return {
			status: 403,
			body: 'Forbidden'
		};
	}

	const entries = await request.json();
	createEntries(id, entries.entries);
	return new Response(null, { status: 204 });
}
