import { getProject } from '$lib/server/db.js';
import { openai } from '$lib/server/openai.js';
import { assembleQuestionAnswerExamples } from '$lib/server/util/prompts.js';

export async function POST({ cookies }) {
	const id = cookies.get('userid');
	if (!id) {
		return new Response('Forbidden', { status: 403 });
	}

	const project = getProject(id);
	if (!project) {
		return new Response('Forbidden', { status: 403 });
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
		return new Response('Forbidden', { status: 403 });
	}

	return new Response(prompt, { status: 200 });
}
