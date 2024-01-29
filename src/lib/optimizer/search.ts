/**
 * This file contains classes and methods for hyperparameter search and model configuration.
 */

import type { CausalModel } from './models/model';

/**
 * A specific hyperparameter value
 */
class Hyperparameter {
	name: string;
	value: number | string;

	constructor(name: string, value: number | string) {
		this.name = name;
		this.value = value;
	}
}

/**
 * A range of values for a hyperparameter
 */
class HyperparameterRange {
	name: string;
	values: number[] | string[];

	constructor(name: string, values: number[] | string[]) {
		this.name = name;
		this.values = values;
	}
}

/**
 * Configuration of a specific model instance.
 */
export class ModelConfiguration {
	parameters: Hyperparameter[];

	constructor(parameters: Hyperparameter[]) {
		this.parameters = parameters;
	}
}

class SearchResult {
	modelConfiguration: ModelConfiguration;
	averageMetric: number = -1;
	outputs: string[];
	metrics: number[];

	constructor(modelConfiguration: ModelConfiguration) {
		this.modelConfiguration = modelConfiguration;
		this.outputs = [];
		this.metrics = [];
	}
}

/**
 * Base class for running hyperparameter search.
 */
export class HyperparameterSearch {
	// TODO: treat the model as another hyperparameter.
	// check to make sure at least one hyperparameter is a CausalModel
	// rename causal model.
	private _model: CausalModel;
	private _inputs: string[];
	private _hyperparameterRanges: HyperparameterRange[] = [];
	private _lossFunction: (output: string, input: string) => number;
	private _modelConfigurations: ModelConfiguration[] = [];

	constructor(
		model: CausalModel,
		inputs: string[],
		lossFunction: (output: string, input: string) => number
	) {
		// TODO: what is the original prompt?
		this._model = model;
		this._inputs = inputs;
		this._lossFunction = lossFunction;
	}

	get hyperparameters() {
		return this._hyperparameterRanges;
	}

	get modelConfigurations() {
		return this._modelConfigurations;
	}

	addHyperparameter(name: string, values: number[] | string[]) {
		this._hyperparameterRanges.push(new HyperparameterRange(name, values));
	}

	cartesianProduct<T>(arrays: T[][]): T[][] {
		return arrays.reduce(
			(a, b) => a.map((x) => b.map((y) => x.concat(y))).reduce((a, b) => a.concat(b), []),
			[[]]
		);
	}

	createHyperparameterCombinations(): ModelConfiguration[] {
		// create all combinations of hyperparameters
		const hyperparameterCombinations: ModelConfiguration[] = [];
		const hyperparameterNames = this.hyperparameters.map((parameter) => parameter.name);
		const hyperparameterValues = this.hyperparameters.map((parameter) => parameter.values);
		const hyperparameterValueCombinations = this.cartesianProduct(hyperparameterValues);
		for (const combination of hyperparameterValueCombinations) {
			const parameters: Hyperparameter[] = [];
			for (let i = 0; i < hyperparameterNames.length; i++) {
				parameters.push(new Hyperparameter(hyperparameterNames[i], combination[i]));
			}
			hyperparameterCombinations.push(new ModelConfiguration(parameters));
		}
		return hyperparameterCombinations;
	}

	search(): SearchResult[] {
		this._modelConfigurations = this.createHyperparameterCombinations();
		// run inference and calculate loss for each model configuration
		const results: SearchResult[] = [];
		this._modelConfigurations.forEach((configuration) => {
			const model = this._model.copy();
			model.config = configuration;

			// generate a prompt for the model using the config
			// pass the prompt and the config to the model

			const searchResult = new SearchResult(configuration);

			this._inputs.forEach((input) => {
				searchResult.outputs.push(model.completion(input));
				searchResult.metrics.push(
					this._lossFunction(searchResult.outputs[searchResult.outputs.length - 1], input)
				);
			});
			searchResult.averageMetric =
				searchResult.metrics.reduce((a, b) => a + b, 0) / searchResult.metrics.length;
			results.push(searchResult);
		});

		return results.sort((a, b) => a.averageMetric - b.averageMetric);
	}
}
