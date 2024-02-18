import { error } from '@sveltejs/kit';

export async function POST({ params, request, locals: { supabase } }) {
	const requestData = await request.json();
	const showLabels = requestData.showLabels;

	const res = await supabase
		.from('projects')
		.update({ show_labels: showLabels })
		.eq('id', params.id);

	if (res.error) {
		error(500, res.error.message);
	}
	return new Response(null, { status: 200 });
}
