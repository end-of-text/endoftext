import { error, redirect } from '@sveltejs/kit';

export const GET = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');

	if (code) {
		await supabase.auth.exchangeCodeForSession(code);
	}

	const userResponse = await supabase.auth.getUser();
	if (userResponse.error) {
		error(500, userResponse.error.message);
	}

	const user = userResponse.data.user;
	const { error: err } = await supabase.from('users').insert({ id: user?.id, email: user?.email });

	if (err) {
		error(500, err.message);
	}

	redirect(303, '/home');
};
