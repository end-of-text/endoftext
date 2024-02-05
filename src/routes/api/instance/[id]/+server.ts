import { error } from '@sveltejs/kit';

export async function DELETE({ params, locals: { supabase, getSession } }) {
	const session = getSession();
	if (!session) {
		error(401, 'Forbidden');
	}

	const res = await supabase.from('instances').delete().eq('id', params.id).select();

	if (res.error) {
		error(500, res.error.message);
	}
	return new Response(null, { status: 200 });
}