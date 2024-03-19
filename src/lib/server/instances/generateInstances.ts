import { OPENAI_API_KEY } from '$env/static/private';
import { OpenAILLM } from '$lib/server/llms/openai';
import type { Tables } from '$lib/supabase';
import { fetchPrompt } from '../prompts';

const generationPrompt = (await fetchPrompt('iMJ2kDrR', '645')).replace(
	'You return exactly this number of examples: 5',
	`You return exactly this number of examples: `
);
const generationWithInstructionPrompt = (await fetchPrompt('sEHttynd', '646')).replace(
	'You return exactly this number of examples: 5',
	`You return exactly this number of examples: `
);
const generationNoInstancesPrompt = (await fetchPrompt('OKS2UKfb', '647')).replace(
	'You return exactly this number of examples: 5',
	`You return exactly this number of examples: `
);

export async function generateInstances(
	prompt: string,
	instances: Tables<'instances'>[],
	count: number,
	instruction?: string
) {
	const openai = new OpenAILLM(OPENAI_API_KEY || '');
	let newInstances: string | null = '';
	if (instances.length === 0) {
		newInstances = await openai.generate(
			[
				{ role: 'system', content: generationNoInstancesPrompt + count },
				{ role: 'user', content: prompt }
			],
			{ json: true }
		);
	} else if (!instruction) {
		newInstances = await openai.generate(
			[
				{ role: 'system', content: generationPrompt + count },
				{
					role: 'user',
					content: `Prompt: ${prompt}\nExamples: ${instances.map((instance) => instance.input).join('\n')}`
				}
			],
			{ json: true }
		);
	} else {
		newInstances = await openai.generate(
			[
				{ role: 'system', content: generationWithInstructionPrompt + count },
				{
					role: 'user',
					content: `Prompt:\n"""${prompt}"""\nExamples:\n"""${instances.map((instance) => instance.input).join('\n')}"""\nInstruction:"""${instruction}"""`
				}
			],
			{ json: true }
		);
	}
	return newInstances;
}
