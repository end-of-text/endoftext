import type { Tables } from '$lib/supabase.js';

export async function PATCH({ locals: { supabase, getSession }, request }) {
	const session = getSession();
	if (!session) {
		return new Response('Forbidden', { status: 401 });
	}

	const requestData = await request.json();
	const instance = requestData.instance as Tables<'instances'> | undefined;
	if (!instance) {
		return new Response('Internal Server Error', { status: 500 });
	}

	const res = await supabase
		.from('instances')
		.update({ input: instance.input, label: instance.label })
		.eq('id', instance.id);

	if (res.error) {
		return new Response(res.error.message, { status: 500 });
	}
	return new Response(null, { status: 200 });
}

export async function PUT({ locals: { supabase, getSession }, request }) {
	const session = getSession();
	if (!session) {
		return new Response('Forbidden', { status: 401 });
	}

	const requestData = await request.json();
	const projectId = requestData.projectId as string | undefined;

	const res = await supabase
		.from('instances')
		.insert({
			project_id: projectId,
			input: '',
			label: ''
		})
		.select()
		.single();

	if (res.error) {
		return new Response(res.error.message, { status: 500 });
	} else {
		return new Response(JSON.stringify(res.data), { status: 200 });
	}
}
