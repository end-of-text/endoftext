import type { LLM } from '../llms/llm';

/**
 * Get the indices of the sentences in the given prompt that match any of the filter prompts.
 * @param prompt target propmt to be filtered
 * @param llm language model to be used
 * @param filterPrompts filter prompts to be used
 * @returns the indices of the sentences in the given prompt that match any of the filter prompts
 *     or null if no sentences match the filter prompts
 */
export async function filterSentences(
	prompt: string,
	llm: LLM,
	filterPrompts: string[]
): Promise<number[][] | null> {
	const segmenter = new Intl.Segmenter('en', {
		granularity: 'sentence'
	});

	const segments = segmenter.segment(prompt);

	let phrases = [...segments].map((segment) => {
		return {
			phrase: segment.segment.trim(),
			start: segment.index,
			end: segment.index + segment.segment.length - 1,
			candidateSentence: false
		};
	});

	for (const filterPrompt of filterPrompts) {
		phrases = await Promise.all(
			phrases.map(async (phrase) => {
				const res = await llm.generate(
					[
						{
							role: 'system',
							content: filterPrompt
						},
						{
							role: 'user',
							content: phrase.phrase
						}
					],
					{ json: true, temperature: 0 }
				);
				const output = JSON.parse(res || '{}')['output'];
				return { ...phrase, candidateSentence: Boolean(output) };
			})
		);
	}

	if (phrases.some((p) => p.candidateSentence)) {
		return phrases.filter((p) => p.candidateSentence).map((p) => [p.start, p.end]);
	} else {
		return null;
	}
}

export async function rewriteSentences(
	prompt: string,
	targetSpans: number[][],
	llm: LLM,
	editPrompt: string
): Promise<string> {
	const rewrittenPhrases = await Promise.all(
		targetSpans.map(async (span) => {
			const phrase = prompt.substring(span[0], span[1] + 1);
			return await llm.generate(
				[
					{
						role: 'system',
						content: editPrompt
					},
					{
						role: 'user',
						content: phrase
					}
				],
				{ temperature: 0 }
			);
		})
	);

	let lastEnd = 0;
	let returnPrompt = '';
	targetSpans.forEach((span, i) => {
		returnPrompt += prompt.substring(lastEnd, span[0]).trim() + ' ';
		returnPrompt += rewrittenPhrases[i] + ' ';
		lastEnd = span[1] + 1;
	});
	returnPrompt += prompt.substring(lastEnd).trim();

	return returnPrompt;
}
