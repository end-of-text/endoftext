import { describe, expect, test } from 'vitest';
import { exact_match_metric, fuzzy_match_metric } from './metric';

describe('Metric tests', () => {
	test('exact_match_metric', () => {
		expect(exact_match_metric('hello', 'hello')).toBe(1);
		expect(exact_match_metric('hello', 'goodbye')).toBe(0);
		expect(exact_match_metric('hello', 'hell')).toBe(0);
	});

	test('fuzzy_match_metric', () => {
		expect(fuzzy_match_metric('hello', 'hello')).toBe(1);
		expect(fuzzy_match_metric('hello', 'hell')).toBe(0);
		expect(fuzzy_match_metric('hello', 'goodbye')).toBe(0);
		expect(fuzzy_match_metric('hell', 'hello')).toBe(1);
	});
});
