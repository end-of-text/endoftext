import type { Tables } from '$lib/supabase.js';
import { error } from '@sveltejs/kit';

export async function POST({ locals: { supabase }, request }) {
	const requestData = await request.json();
	const instances = requestData.instances as Tables<'instances'>[] | undefined;
	if (!instances) {
		error(500, 'Invalid data');
	}
	const res = await supabase.from('instances').upsert(instances);
	if (res.error) {
		error(500, res.error.message);
	}
	return new Response(null, { status: 200 });
}
