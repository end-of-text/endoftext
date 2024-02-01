import type { Instance } from '$lib/types.js';

export async function PUT({ locals: { supabase, getSession }, request }) {
	const session = getSession();
	if (!session) {
		return new Response('Forbidden', { status: 401 });
	}

	const requestData = await request.json();
	const instance = requestData.instance as Instance;
	if (!instance) {
		return new Response('Internal Server Error', { status: 500 });
	}

	const res = await supabase
		.from('instances')
		.update({ input: instance.input, label: instance.label })
		.eq('id', instance.id)
		.select();

	if (res.error) {
		return new Response(res.error.message, { status: 500 });
	}
	return new Response(null, { status: 200 });
}
