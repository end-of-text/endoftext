import { error } from '@sveltejs/kit';

export async function load({ locals: { getSession } }) {
	const session = await getSession();

	if (!session) {
		error(401, { message: 'Forbidden' });
	}

	return {
		userEmail: session.user.email
	};
}
