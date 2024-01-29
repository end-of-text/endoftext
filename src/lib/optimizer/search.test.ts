import { describe, expect, test } from 'vitest';
import { OpenAIModel } from './models/openai';
import { HyperparameterSearch } from './search';

describe('hyperparameter search', () => {
	const search = new HyperparameterSearch(new OpenAIModel('abc'), ['a', 'b', 'c'], 'mse', 'linear');
	search.addHyperparameter('learningRate', [0.1, 0.5]);
	search.addHyperparameter('addition', ['a', 'acs', 'bbb']);

	test('can create search object', () => {
		expect(search.hyperparameters.length).toBe(2);
	});

	test('can create hyperparameter combinations', () => {
		search.search();
		expect(search.modelConfigurations.length).toBe(6);
	});
});
