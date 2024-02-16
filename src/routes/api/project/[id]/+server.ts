import { error } from '@sveltejs/kit';

export async function DELETE({ params, locals: { supabase, getSession } }) {
	const session = await getSession();

	if (!session) {
		return error(401, 'Forbidden');
	}

	await supabase.from('projects').delete().eq('id', params.id);
}
