import { error } from '@sveltejs/kit';

export async function DELETE({ locals: { supabase, getSession }, params }) {
	const session = await getSession();
	if (!session) {
		error(401, 'Unauthorized');
	}

	const suggestionId = params.id;

	const { error: err } = await supabase.from('suggestions').delete().eq('id', suggestionId);

	if (err) {
		error(500, 'Error deleting suggestion');
	}

	return new Response(null, { status: 204 });
}
