function createNgrams(s: string, n: number): Map<string, number> {
	const ngrams = new Map<string, number>();
	for (let i = 0; i < s.length - n + 1; i++) {
		const ngram = s.substring(i, i + n);
		ngrams.set(ngram, (ngrams.get(ngram) || 0) + 1);
	}
	return ngrams;
}

export function chrfMetric(
	reference: string,
	hypothesis: string,
	n: number = 6,
	beta: number = 2
): number {
	if (reference === hypothesis) {
		return 1;
	}
	if (reference.length === 0 || hypothesis.length === 0) {
		return 0;
	}

	let precisionSum = 0;
	let recallSum = 0;

	for (let size = 1; size <= n; size++) {
		const refNgrams = createNgrams(reference, size);
		const hypNgrams = createNgrams(hypothesis, size);

		let overlap = 0;
		hypNgrams.forEach((count, ngram) => {
			overlap += Math.min(count, refNgrams.get(ngram) || 0);
		});

		const hypTotal = Array.from(hypNgrams.values()).reduce((a, b) => a + b, 0);
		const refTotal = Array.from(refNgrams.values()).reduce((a, b) => a + b, 0);

		const precision = hypTotal > 0 ? overlap / hypTotal : 0;
		const recall = refTotal > 0 ? overlap / refTotal : 0;

		precisionSum += precision;
		recallSum += recall;
	}

	const avgPrecision = precisionSum / n;
	const avgRecall = recallSum / n;

	const fScore =
		precisionSum === 0 && recallSum === 0
			? 0
			: (1 + beta ** 2) * ((avgPrecision * avgRecall) / (beta ** 2 * avgPrecision + avgRecall));
	return !isFinite(fScore) ? 0 : fScore;
}

export function exactMatchMetric(hyp: string, ref: string): number {
	return hyp === ref ? 1 : 0;
}

export function fuzzyMatchMetric(hyp: string, ref: string): number {
	return ref.includes(hyp) ? 1 : 0;
}
