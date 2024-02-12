import { SUPABASE_ANON_KEY, SUPABASE_URL } from '$env/static/private';
import { PUBLIC_AMPLITUDE_API_KEY } from '$env/static/public';
import type { Database } from '$lib/supabase';
import * as amplitude from '@amplitude/analytics-node';
import { createServerClient } from '@supabase/ssr';

export const handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				event.cookies.set(key, value, { ...options, path: '/' });
			},
			remove: (key, options) => {
				event.cookies.delete(key, { ...options, path: '/' });
			}
		}
	});

	event.locals.getSession = async () => {
		let {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		const { data: getUserData } = await event.locals.supabase.auth.getUser();
		if (getUserData.user == null) {
			session = null;
		}

		return session;
	};

	amplitude.init(PUBLIC_AMPLITUDE_API_KEY);

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
