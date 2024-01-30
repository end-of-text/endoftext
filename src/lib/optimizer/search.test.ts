import { describe, expect, test } from 'vitest';
import { exactMatchMetric } from './metric';
import { HyperparameterSearch } from './search';
import { HyperparameterType } from './types';

describe('hyperparameter search', () => {
	const search = new HyperparameterSearch(
		'Classify sentiment of this movie using a 0 for negative and 1 for positive. Only return the number.',
		['I hated this movie', 'I loved this movie', 'I thought this movie was pretty meh'],
		['0', '1', '0'],
		exactMatchMetric,
		[
			{
				name: 'llm',
				type: HyperparameterType.LLM,
				values: ['test']
			},
			{ name: 'temperature', type: HyperparameterType.SYSTEM, values: [1, 1.5] },
			{ name: 'tip', type: HyperparameterType.PROMPT, values: ['', 'I will tip $100'] }
		]
	);

	test('can create search object', () => {
		expect(search.hyperparameterRanges.length).toBe(3);
	});

	test('can create hyperparameter combinations', async () => {
		const res = await search.search();
		expect(search.modelConfigurations.length).toBe(4);
		expect(res.length).toBe(4);
	});
});
