import { STRIPE_API_KEY } from '$env/static/private';
import { error, fail, redirect } from '@sveltejs/kit';
import Stripe from 'stripe';

export const load = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		redirect(303, '/');
	}

	const { data: subscription, error: err } = await supabase
		.from('user_subscription')
		.select('status, stripe_id')
		.eq('id', session.user.id)
		.single();

	if (err) {
		error(500, err.message);
	}

	return { userId: session.user.id, subscription };
};

export const actions = {
	signout: async ({ locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (session) {
			await supabase.auth.signOut();
			redirect(303, '/');
		}
	},
	manage: async ({ request, locals: { getSession } }) => {
		const session = await getSession();
		if (session === null) {
			fail(401, { message: 'Unauthorized' });
		} else {
			// get form options
			const formData = await request.formData();
			const stripeId = formData.get('stripeId') as string;
			const stripe = new Stripe(STRIPE_API_KEY);

			const res = await stripe.billingPortal.sessions.create({
				customer: stripeId
			});

			if (res.url === null) {
				fail(500, { message: 'Internal Server Error' });
			} else {
				redirect(303, res.url);
			}
		}
	},
	subscribe: async ({ url, locals: { getSession } }) => {
		const session = await getSession();
		if (session === null) {
			fail(401, { message: 'Unauthorized' });
		} else {
			const stripe = new Stripe(STRIPE_API_KEY);

			const res = await stripe.checkout.sessions.create({
				customer_email: session.user.email,
				mode: 'subscription',
				line_items: [
					{
						price: 'price_1OiK8qFC5aU17b6GNc9gm9Sr',
						quantity: 1
					}
				],
				success_url: `${url.origin}/home/account?success=true`,
				cancel_url: `${url.origin}/home/account?canceled=true`
			});

			if (res.url === null) {
				fail(500, { message: 'Internal Server Error' });
			} else {
				redirect(303, res.url);
			}
		}
	}
};
