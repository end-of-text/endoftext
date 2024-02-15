import { trackEvent } from '$lib/server/amplitude.js';
import type { EmailOtpType } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;
	const token_hash = url.searchParams.get('token_hash') as string;
	const type = url.searchParams.get('type') as string;
	const next = url.searchParams.get('next') ?? '/';

	if (token_hash && type) {
		const { data, error } = await supabase.auth.verifyOtp({
			token_hash,
			type: type as EmailOtpType
		});

		const res = await supabase
			.from('users')
			.insert([{ id: data.user?.id, email: data.user?.email }]);

		if (res.error) {
			fail(500, {
				error: 'Server error. Please try again later.'
			});
		}

		if (!error) {
			trackEvent('Signup', undefined, { user_id: data.user?.id });
			redirect(303, `/${next.slice(1)}`);
		}
	}

	// return the user to an error page with some instructions
	redirect(303, '/auth/auth-code-error');
};
