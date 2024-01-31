import {
	HyperparameterType,
	type Entry,
	type HyperparameterRange,
	type HyperparameterValue,
	type SearchResult
} from '$lib/types';
import { LLMMap } from './models/llmMap';

export class HyperparameterSearch {
	public modelConfigurations: HyperparameterValue[][] = [];

	constructor(
		private readonly prompt: string,
		private readonly inputs: Entry[],
		private readonly lossFunction: (output: string, input: string) => number,
		readonly hyperparameterRanges: HyperparameterRange[]
	) {}

	cartesianProduct<T>(arrays: T[][]): T[][] {
		const cartesianProduct: T[][] = [];
		const helper = (index: number, current: T[]) => {
			if (index === arrays.length) {
				cartesianProduct.push(current.slice());
				return;
			}
			for (let i = 0; i < arrays[index].length; i++) {
				current.push(arrays[index][i]);
				helper(index + 1, current);
				current.pop();
			}
		};
		helper(0, []);
		return cartesianProduct;
	}

	createPrompt(originalPrompt: string, promptAdditions: HyperparameterValue[]) {
		let prompt = originalPrompt;
		promptAdditions
			.filter((c) => c.type === HyperparameterType.PROMPT)
			.forEach((addition) => {
				if (addition.value !== '') {
					prompt += '\n\n' + addition.value;
				}
			});
		return prompt;
	}

	createHyperparameterCombinations(): HyperparameterValue[][] {
		const hyperparameterValues: HyperparameterValue[][] = [];
		this.hyperparameterRanges.forEach((range) => {
			hyperparameterValues.push(
				range.values.map((value) => ({ name: range.name, type: range.type, value: value }))
			);
		});

		const hyperparameterCombinations = this.cartesianProduct(hyperparameterValues);
		return hyperparameterCombinations.map((combination) => combination);
	}

	async search(): Promise<SearchResult[]> {
		const llms = this.hyperparameterRanges.filter((range) => range.type === HyperparameterType.LLM);
		if (llms.length === 0) {
			throw new Error('No LLM hyperparameter found');
		} else if (llms.length > 1) {
			throw new Error('More than one LLM hyperparameter found');
		}

		this.modelConfigurations = this.createHyperparameterCombinations();

		const results: SearchResult[] = [];
		for (const configuration of this.modelConfigurations) {
			const llmName = configuration.find((parameter) => parameter.type === HyperparameterType.LLM);
			if (!llmName) {
				throw new Error('No LLM hyperparameter found');
			}
			const llm = LLMMap[llmName.value as string];
			llm.config = new Map(configuration.map((parameter) => [parameter.name, parameter]));

			const prompt = this.createPrompt(this.prompt, configuration);

			const outputs: Record<string, { text: string; metric: number }> = {};
			const metrics: number[] = [];
			for (let i = 0; i < this.inputs.length; i++) {
				const output = await llm.completion(prompt, this.inputs[i].question);
				outputs[this.inputs[i].id] = {
					text: output,
					metric: this.lossFunction(output, this.inputs[i].answer)
				};
				metrics.push(outputs[this.inputs[i].id].metric);
			}
			const averageMetric = metrics.reduce((a, b) => a + b, 0) / metrics.length;
			results.push({ modelConfiguration: configuration, averageMetric, outputs, prompt });
		}
		return results.sort((a, b) => a.averageMetric - b.averageMetric);
	}
}
