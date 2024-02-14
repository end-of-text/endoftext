import type { LLM } from '$lib/server/llms/llm';
import type { Tables } from '$lib/supabase';
import type { EditorType, RequiredInputType } from '$lib/types';

export abstract class PromptEditor {
	/** Create a new prompt editor.
	 *
	 * @param id string identifier of the editor
	 * @param name human-readable name of the editor
	 * @param description description of the editor
	 * @param type type of the editor
	 * @param llm the language model to be used
	 */
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly description: string,
		public readonly type: EditorType,
		public readonly requiredInputType: RequiredInputType | undefined = undefined
	) {}

	/** Determine if it makes sense to apply the editor to the prompt.
	 *
	 * @param prompt the prompt to be checked
	 * @param llm the language model to be used
	 * @param instancePredictions instances and predictions associated with the prompt
	 * @returns a numeric array with the relevant spans of the prompt to be modified
	 * 		(an empty array if it's for the full prompt),
	 * 		or null if the editor should not be applied.
	 */
	abstract canBeApplied(
		prompt: Tables<'prompts'>,
		llm: LLM,
		instancePredictions: {
			id: number;
			input: string;
			label: string;
			predictions: { prediction: string }[];
		}[]
	): Promise<number[] | null>;

	/** Modify the prompt using the editor.
	 *
	 * @param prompt the prompt to be modified
	 * @param llm the language model to be used
	 * @param instancePredictions instances and predictions associated with the prompt
	 * @returns the modified prompt
	 */
	abstract rewritePrompt(
		prompt: Tables<'prompts'>,
		targetSpans: number[],
		llm: LLM,
		instancePredictions: {
			id: number;
			input: string;
			label: string;
			predictions: { prediction: string }[];
		}[],
		input: string | unknown
	): Promise<string>;
}
