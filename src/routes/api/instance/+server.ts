import { trackEvent } from '$lib/server/amplitude.js';
import type { Tables } from '$lib/supabase.js';
import { error, json } from '@sveltejs/kit';

export async function PATCH({ locals: { supabase }, request }) {
	const requestData = await request.json();
	const instance = requestData.instance as Tables<'instances'> | undefined;
	if (!instance) {
		error(500, 'Invalid instance data');
	}

	const instanceRes = await supabase
		.from('instances')
		.update({ input: instance.input, label: instance.label })
		.eq('id', instance.id);

	if (instanceRes.error) {
		error(500, instanceRes.error.message);
	}

	return new Response(null, { status: 200 });
}

export async function PUT({ locals: { supabase, getSession }, request }) {
	const session = await getSession();
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
		error(500, res.error.message);
	} else {
		trackEvent('Instance Created', { user_id: session?.user.id ?? '' });
		return json(res.data);
	}
}
