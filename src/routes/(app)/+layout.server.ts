import { error, redirect } from '@sveltejs/kit';

export async function load({ url, locals: { getSession, supabase } }) {
	const session = await getSession();
	if (!session) {
		redirect(303, `/auth?redirectto=${url.pathname}`);
	}

	const { data: subscription, error: err } = await supabase
		.from('user_subscription')
		.select('status, stripe_id')
		.eq('id', session.user.id)
		.single();

	if (err) {
		error(500, err.message);
	}

	return {
		user: {
			id: session.user.id,
			email: session.user.email,
			status: subscription?.status,
			stripeId: subscription?.stripe_id
		}
	};
}
