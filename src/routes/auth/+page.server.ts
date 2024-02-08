import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (error) {
			return fail(500, { message: 'Server error. Try again later.', success: false, email });
		}
		redirect(303, '/home');
	},

	signup: async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${url.origin}/auth/callback`
			}
		});
		if (error) {
			if (error instanceof AuthApiError && error.status >= 400 && error.status < 500) {
				return fail(400, {
					error: 'invalidCredentials',
					email: email,
					invalid: true,
					message: error.message
				});
			}
			return fail(500, {
				error: 'Server error. Please try again later.'
			});
		}

		if (!error && !!data.user && !data.user.identities?.length) {
			return fail(409, {
				error: 'User already exists',
				email: email,
				invalid: true,
				message: 'User already exists'
			});
		}

		const res = await supabase.from('users').insert([{ id: data.user?.id, email: email }]);

		if (res.error) {
			return fail(500, {
				error: 'Server error. Please try again later.'
			});
		}

		return { success: true };
	}
};
