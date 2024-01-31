import { clearEntries, createEntries } from '$lib/server/db';
import { fromCSV } from 'arquero';

export async function POST({ cookies, request }) {
	const id = cookies.get('userid');
	if (!id) {
		return new Response('Forbidden', { status: 403 });
	}

	const requestData = await request.json();
	if (requestData.clear) {
		clearEntries(id);
	}
	const table = fromCSV(requestData.entries);
	createEntries(id, table);
	return new Response(null, { status: 204 });
}
