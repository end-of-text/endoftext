import { STRIPE_API_KEY } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';
import Stripe from 'stripe';

export const load = async ({ parent, locals: { getSession } }) => {
	const session = await getSession();
	if (!session) {
		redirect(303, '/');
	}

	const parentData = await parent();
	return {
		user: {
			email: session.user.email,
			status: parentData.user.status,
			stripeId: parentData.user.stripeId
		}
	};
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
						price: 'price_1Ok9RwFC5aU17b6GrbT3sNaS',
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
