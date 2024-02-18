import { trackEvent } from '$lib/server/amplitude.js';
import { error } from '@sveltejs/kit';

export async function DELETE({ params, locals: { supabase, getSession } }) {
	const session = await getSession();

	const res = await supabase.from('instances').delete().eq('id', params.id).select();

	if (res.error) {
		error(500, res.error.message);
	}
	trackEvent('Instances Deleted', { number: 1 }, { user_id: session?.user.id ?? '' });
	return new Response(null, { status: 200 });
}
