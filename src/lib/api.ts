import type { Tables } from './supabase';

export async function getPrediction(
	prompt: Tables<'prompts'>,
	instanceId: number,
	input: string,
	clear: boolean = false
): Promise<Tables<'predictions'> | undefined> {
	if (input === '') {
		return undefined;
	}

	const response = await fetch(`/api/prediction`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ prompt, instanceId, input, clear })
	});
	const res = await response.json();
	return res.prediction as Tables<'predictions'>;
}

export async function updateInstance(instance: Tables<'instances'>) {
	await fetch(`/api/instance`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ instance: instance })
	});
}

export async function deleteInstance(instanceId: number) {
	await fetch(`/api/instance/${instanceId}`, {
		method: 'DELETE'
	});
}

export async function deleteInstances(instanceIds: number[]) {
	await fetch(`/api/instances`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ instanceIds })
	});
}

export async function createInstance(projectId: string) {
	const res = await fetch(`/api/instance`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ projectId: projectId })
	});
	const json = await res.json();
	return json as Tables<'instances'>;
}

export async function updatePrompt(prompt: Tables<'prompts'>): Promise<Tables<'prompts'> | null> {
	const res = await fetch(`/api/prompt`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ prompt })
	});

	if (!res.ok) {
		return null;
	}

	const json = await res.json();
	return json as Tables<'prompts'>;
}

export async function getMetric(
	prompt: Tables<'prompts'>,
	label: string | null,
	predictionPromise: Promise<Tables<'predictions'> | undefined>,
	metricName: string | null
): Promise<number | undefined> {
	const prediction = await predictionPromise;
	if (label === null || metricName === null || label === undefined || prediction === undefined) {
		return;
	}

	const response = await fetch(`/api/metric`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			prompt,
			label,
			prediction,
			metricName
		})
	});
	return await response.json();
}

export async function getSuggestions(
	selectedPrompt: Tables<'prompts'> | undefined,
	clear: boolean = false
): Promise<Tables<'suggestions'>[]> {
	if (selectedPrompt === undefined) {
		return [];
	}

	const response = await fetch(`/api/editor/suggestions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ selectedPrompt: selectedPrompt, clear })
	});
	const jsonResponse = await response.json();
	return jsonResponse as Tables<'suggestions'>[];
}

export async function acceptSuggestion(
	suggestion: Tables<'suggestions'>,
	prompt: Tables<'prompts'>,
	userInput: string | undefined
): Promise<Tables<'prompts'>> {
	const res = await fetch(`/api/editor/suggestions/accept`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			suggestion,
			prompt,
			userInput
		})
	});
	const json = await res.json();
	return json.prompt as Tables<'prompts'>;
}

export async function generateInstances(
	prompt: Tables<'prompts'>,
	instances: Tables<'instances'>[],
	count: number
): Promise<Tables<'instances'>[]> {
	const res = await fetch(`/api/instances`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ prompt, instances, count })
	});
	const json = await res.json();
	return json.instances as Tables<'instances'>[];
}

export async function getProjectUsers(projectId: string): Promise<Tables<'users'>[]> {
	const res = await fetch(`/api/project/${projectId}/users`);
	const json = await res.json();
	return json as Tables<'users'>[];
}

export async function addProjectUser(projectId: string, email: string): Promise<void> {
	await fetch(`/api/project/${projectId}/users`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email })
	});
}

export async function removeProjectUser(projectId: string, userId: string): Promise<void> {
	await fetch(`/api/project/${projectId}/users`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ userId })
	});
}

export async function toggleProjectLabels(projectId: string, showLabels: boolean): Promise<void> {
	await fetch(`/api/project/${projectId}/labels`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ showLabels })
	});
}

export async function deleteProject(projectId: string): Promise<void> {
	await fetch(`/api/project/${projectId}`, {
		method: 'DELETE'
	});
}

export async function changeProjectMetric(projectId: string, metric: string | null): Promise<void> {
	await fetch(`/api/project/${projectId}/metric`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ metric })
	});
}
