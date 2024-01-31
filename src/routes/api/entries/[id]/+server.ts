import { deleteEntry } from '$lib/server/db.js';

export async function DELETE({ params, cookies }) {
	const id = cookies.get('userid');
	if (!id) {
		return new Response('Forbidden', { status: 403 });
	}

	const entryID = params.id;
	deleteEntry(id, entryID);
	return new Response(null, { status: 204 });
}
