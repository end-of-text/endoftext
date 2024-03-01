import { error, text } from '@sveltejs/kit';

export async function GET({ locals: { supabase, getSession } }) {
	const session = await getSession();
	if (!session) {
		error(401, 'Forbidden');
	}

	await supabase.from('api_keys').delete().eq('user_id', session.user.id);
	const keyRes = await supabase.from('api_keys').insert({ user_id: session.user.id }).select('key');

	if (keyRes.error) {
		error(500, keyRes.error.message);
	}

	return text(keyRes.data[0].key);
}
