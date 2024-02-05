import { generateInstances } from '$lib/server/instances/generateInstances';
import { redirect } from '@sveltejs/kit';

export async function load({ parent, locals: { getSession } }) {
	const session = getSession();

	if (!session) {
		return {
			status: 401,
			body: 'Forbidden'
		};
	}

	const { prompt } = await parent();

	if (!prompt) {
		return {
			status: 500,
			body: 'Internal Server Error'
		};
	}

	const generatedInstances = generateInstances(prompt?.prompt, 5);

	return {
		generatedInstances
	};
}

export const actions = {
	default: async ({ params, request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session) {
			return {
				status: 401,
				body: 'Forbidden'
			};
		}

		const formData = await request.formData();
		const instances = formData.getAll('instance') as string[];

		const res = await supabase.from('instances').insert(
			instances.map((instance) => {
				return {
					project_id: params.id,
					input: instance
				};
			})
		);

		if (res.error) {
			return {
				status: 500,
				body: 'Internal Server Error'
			};
		}

		redirect(303, '/project/' + params.id);
	}
};
