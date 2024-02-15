import { trackEvent } from '$lib/server/amplitude.js';
import { error, redirect } from '@sveltejs/kit';

export const GET = async ({ url, locals: { supabase, getSession } }) => {
	const code = url.searchParams.get('code');

	if (code) {
		await supabase.auth.exchangeCodeForSession(code);
	}

	const session = await getSession();
	if (!session) {
		error(500, 'Error creating user');
	}

	const userResponse = await supabase.from('users').select('id').eq('id', session.user?.id);

	if (userResponse.error) {
		error(500, userResponse.error.message);
	} else if (userResponse.data.length === 0) {
		const { error: err } = await supabase
			.from('users')
			.insert({ id: session.user?.id, email: session.user?.email });

		if (err) {
			error(500, err.message);
		}
		trackEvent('Signup', { user_id: session.user?.id });
	}

	redirect(303, '/home');
};
