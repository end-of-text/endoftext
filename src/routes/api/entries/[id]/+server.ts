import { deleteEntry } from '$lib/server/db.js';

export async function DELETE({ params, cookies }) {
	const id = cookies.get('userid');
	if (!id) {
		return {
			status: 403,
			body: 'Forbidden'
		};
	}

	const entryID = params.id;
	deleteEntry(id, entryID);
	return new Response(null, { status: 204 });
}
