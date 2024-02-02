import type { Instance, Metric, Prediction, Prompt } from '$lib/types';

export async function getPrediction(
	selectedPrompt: Prompt | undefined,
	instance: Instance
): Promise<Prediction | undefined> {
	if (selectedPrompt === undefined) {
		return;
	}

	const response = await fetch(`/api/prediction`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ selectedPrompt: selectedPrompt, instance: instance })
	});
	const jsonResponse = await response.json();
	return jsonResponse as Prediction;
}

export async function updateInstance(instance: Instance) {
	await fetch(`/api/instance`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ instance: instance })
	});
}

export async function getMetric(
	instance: Instance,
	predictionPromise: Promise<Prediction | undefined>
): Promise<Metric | undefined> {
	const prediction = await predictionPromise;
	if (instance.label === undefined || prediction === undefined) {
		return;
	}

	const response = await fetch(`/api/metric`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			instance: instance,
			prediction: prediction
		})
	});
	const jsonResponse = await response.json();
	return jsonResponse as Metric;
}
