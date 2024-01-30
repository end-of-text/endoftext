/**
 * Type of hyperparameter.
 *
 * LLM: which llm to run inference with.
 * SYSTEM: hyperparameter that is specific to the system, e.g. temperature.
 * PROMPT: hyperparameter that modifies a prompt, e.g. adding CoT.
 */
export enum HyperparameterType {
	LLM,
	SYSTEM,
	PROMPT
}

export type HyperparameterValue = {
	name: string;
	type: HyperparameterType;
	value: number | string;
};

export type HyperparameterRange = {
	name: string;
	type: HyperparameterType;
	values: number[] | string[];
};

export type SearchResult = {
	modelConfiguration: HyperparameterValue[];
	averageMetric: number;
	outputs: string[];
	metrics: number[];
};
