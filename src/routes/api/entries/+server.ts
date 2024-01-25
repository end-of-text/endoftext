import { clearEntries, createEntries } from '$lib/server/db';

export async function POST({ cookies, request }) {
	const id = cookies.get('userid');
	if (!id) {
		return {
			status: 403,
			body: 'Forbidden'
		};
	}

	const requestData = await request.json();
	if (requestData.clear) {
		clearEntries(id);
	}
	createEntries(id, requestData.entries);
	return new Response(null, { status: 204 });
}
