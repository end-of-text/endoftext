import { error } from '@sveltejs/kit';

export async function load({ locals: { getSession, supabase } }) {
	const session = await getSession();
	if (!session) {
		error(401, { message: 'Forbidden' });
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
		userId: session.user.id,
		subscription
	};
}
