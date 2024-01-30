import type { Entry } from '$lib/types';

export function assembleQuestionAnswerExamples(entries: Entry[]) {
	let messagePart = '';
	for (const entry of entries) {
		messagePart += `\n\nQ: ${entry.question}\nA: ${entry.answer}`;
	}
	return messagePart;
}
