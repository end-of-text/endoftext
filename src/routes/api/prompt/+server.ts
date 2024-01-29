import { createPrompt, getProject } from '$lib/server/db.js';
import { openai } from '$lib/server/openai.js';
import { assembleQuestionAnswerExamples } from '$lib/server/util/prompts.js';

export async function POST({ cookies }) {
	const id = cookies.get('userid');
	if (!id) {
		return {
			status: 403,
			body: 'Forbidden'
		};
	}

	const project = getProject(id);
	if (!project) {
		return {
			status: 403,
			body: 'Forbidden'
		};
	}

	const prompt = await openai.generate([
		{
			role: 'system',
			content:
				'You are a prompting experts for large language models. You help users generate high-performing prompts for their language models.'
		},
		{
			role: 'user',
			content: `My language model is used for the following task:\n\n${project.taskDescription}`
		},
		{
			role: 'user',
			content: `Here are some example questions and answers:${assembleQuestionAnswerExamples(project.dataEntries)}`
		},
		{
			role: 'system',
			content: `Your output should only be a prompt for the described task. No examples or other text should be included. When used, one question from a user will be appended to the prompt.`
		}
	]);
	if (!prompt) {
		return {
			status: 403,
			body: 'Forbidden'
		};
	}
	createPrompt(id, prompt);

	return new Response(null, { status: 204 });
}
