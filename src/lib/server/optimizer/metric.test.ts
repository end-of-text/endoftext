import { describe, expect, it, test } from 'vitest';
import { chrfMetric, exactMatchMetric, fuzzyMatchMetric } from './metric';

describe('Metric tests', () => {
	test('exact_match_metric', () => {
		expect(exactMatchMetric('hello', 'hello')).toBe(1);
		expect(exactMatchMetric('hello', 'goodbye')).toBe(0);
		expect(exactMatchMetric('hello', 'hell')).toBe(0);
	});

	test('fuzzy_match_metric', () => {
		expect(fuzzyMatchMetric('hello', 'hello')).toBe(1);
		expect(fuzzyMatchMetric('hello', 'hell')).toBe(0);
		expect(fuzzyMatchMetric('hello', 'goodbye')).toBe(0);
		expect(fuzzyMatchMetric('hell', 'hello')).toBe(1);
	});

	describe('chrfMetric', () => {
		it('returns 1 for identical strings', () => {
			const reference = 'hello world';
			const hypothesis = 'hello world';
			const score = chrfMetric(reference, hypothesis);
			expect(score).toBe(1);
		});

		it('returns 0 for empty reference', () => {
			const reference = '';
			const hypothesis = 'hello world';
			const score = chrfMetric(reference, hypothesis);
			expect(score).toBe(0);
		});

		it('returns 0 for empty hypothesis', () => {
			const reference = 'hello world';
			const hypothesis = '';
			const score = chrfMetric(reference, hypothesis);
			expect(score).toBe(0);
		});

		it('calculates a score between 0 and 1 for partial matches', () => {
			const reference = 'hello world';
			const hypothesis = 'hello';
			const score = chrfMetric(reference, hypothesis);
			expect(score).toBeGreaterThan(0);
			expect(score).toBeLessThan(1);
		});

		it('handles different n-gram sizes correctly', () => {
			const reference = 'hello world';
			const hypothesis = 'world hello';
			const score = chrfMetric(reference, hypothesis, 2); // Using bigrams
			expect(score).toBeGreaterThan(0);
			expect(score).toBeLessThan(1);
		});
	});
});
