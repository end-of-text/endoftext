import { OPENAI_API_KEY } from '$env/static/private';
import { OpenAILLM } from '$lib/server/llms/openai';
import type { Tables } from '$lib/supabase';

const generationPrompt = `
You are an assistant that generates example inputs for an AI.
The user will give you a list of existing examples.
Your goal is to generate new inputs that resemble the existing ones but are significantly different.
Try to vary the inputs in a way that is interesting and diverse.
Bonus points for generating examples that are likely to cause the model to fail.

## Examples
Prompt: Extract the numeric rating from this movie review
Examples: ["I give this movie a 5 out of 10", "I rate this movie 3 stars out of 5"]
Output: ["I'd give this movie a 7/10", "I hated this movie", "I loved this movie"]

## Return Format
Return JSON format with the key "instances" and the example inputs as an array.
You return exactly this number of examples: 
`;

const generationNoInstancesPrompt = `
You are an assistant that generates example inputs for an AI.
The user will give you an AI prompt.
Your goal is to generate example inputs that a human would give to that prompt.
You should generate diverse inputs that are varied in terms of length, format, and content.

## Return Format
Return JSON format with the key "instances" and the example inputs as an array.
You return exactly this number of examples: 
`;

export async function generateInstances(
	prompt: string,
	instances: Tables<'instances'>[],
	count: number
) {
	const openai = new OpenAILLM(OPENAI_API_KEY || '');
	if (instances.length === 0) {
		const newInstances = await openai.generate(
			[
				{ role: 'system', content: generationNoInstancesPrompt + count },
				{ role: 'user', content: prompt }
			],
			{ json: true }
		);
		return newInstances;
	} else {
		console.log(instances);
		const newInstances = await openai.generate(
			[
				{ role: 'system', content: generationPrompt + count },
				{
					role: 'user',
					content: `Prompt: ${prompt}\nExamples: ${instances.map((instance) => instance.input).join('\n')}`
				}
			],
			{ json: true }
		);
		return newInstances;
	}
}
