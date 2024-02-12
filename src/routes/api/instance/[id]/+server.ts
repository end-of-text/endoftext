import { track } from '@amplitude/analytics-node';
import { error } from '@sveltejs/kit';

export async function DELETE({ params, locals: { supabase, getSession } }) {
	const session = await getSession();
	if (!session) {
		error(401, 'Forbidden');
	}

	const res = await supabase.from('instances').delete().eq('id', params.id).select();

	if (res.error) {
		error(500, res.error.message);
	}
	track('Instances Deleted', { user_id: session.user.id, number: 1 });
	return new Response(null, { status: 200 });
}
