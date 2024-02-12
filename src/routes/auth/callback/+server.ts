import { track } from '@amplitude/analytics-node';
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

	const { error: err } = await supabase
		.from('users')
		.insert({ id: session.user?.id, email: session.user?.email });

	if (err) {
		error(500, err.message);
	}

	track('Signup');
	redirect(303, '/home');
};
