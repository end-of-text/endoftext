import { createProject } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export function load({ cookies }) {
	let id = cookies.get('userid');

	if (!id) {
		id = crypto.randomUUID();
		cookies.set('userid', id, { path: '/' });
	}
}

export const actions = {
	default: async ({ request, cookies }) => {
		const id = cookies.get('userid');
		if (!id) {
			return {
				status: 403,
				body: 'Forbidden'
			};
		}

		const formData = await request.formData();
		const task = formData.get('task');

		if (task) {
			createProject(id, task.toString());
			redirect(303, '/new/data');
		}
	}
};
