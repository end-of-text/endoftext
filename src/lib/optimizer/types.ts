/**
 * Type of hyperparameter.
 *
 * LLM: llm to run inference with.
 * SYSTEM: model-specific hyperparameter, e.g. temperature.
 * PROMPT: textual prompt addition, e.g. chain-of-thought instructions.
 * ENHANCEMENT: re-write prompt to change order, structure, up-scale.
 * COMPRESSION: re-write prompt to shorten, simplify, and make cheaper to run.
 */
export enum HyperparameterType {
	LLM,
	SYSTEM,
	PROMPT,
	ENHANCEMENT,
	COMPRESSION
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
