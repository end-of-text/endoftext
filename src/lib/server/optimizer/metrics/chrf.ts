/*
  This code is based on the following repository and paper: https://github.com/m-popovic/chrF/tree/master
  A direct copy of the implementation in TS can be found here: https://gist.github.com/Sparkier/39ebaa1f196a22ad0527b5bdf82cbdc4

  However, we don't want to apply the line-splitting that they do. Hence this has been modified and might produce different results.
*/
const PUNCTUATION = /\p{P}/u;

function separateCharacters(line: string): string[] {
	return Array.from(line.trim().replaceAll('\n', '').replaceAll(' ', ''));
}

function separatePunctuation(line: string): string[] {
	const words = line.trim().split(' ');
	const tokenized: string[] = [];

	for (const word of words) {
		if (word.length === 1) {
			tokenized.push(word);
		} else {
			const lastChar = word[word.length - 1];
			const firstChar = word[0];

			if (PUNCTUATION.test(lastChar)) {
				tokenized.push(word.slice(0, -1), lastChar);
			} else if (PUNCTUATION.test(firstChar)) {
				tokenized.push(firstChar, word.slice(1));
			} else {
				tokenized.push(word);
			}
		}
	}

	return tokenized;
}

function ngramCounts(wordList: string[], order: number): Record<number, Record<string, number>> {
	const counts: Record<number, Record<string, number>> = {};
	const nWords = wordList.length;

	for (let i = 0; i < nWords; i++) {
		for (let j = 1; j <= order; j++) {
			if (i + j <= nWords) {
				const ngram = wordList.slice(i, i + j).join('');
				counts[j - 1] = counts[j - 1] || {};
				counts[j - 1][ngram] = (counts[j - 1][ngram] || 0) + 1;
			}
		}
	}

	return counts;
}

function ngramMatches(
	refNgrams: Record<number, Record<string, number>>,
	hypNgrams: Record<number, Record<string, number>>
): [Record<number, number>, Record<number, number>, Record<number, number>] {
	const matchingNgramCount: Record<number, number> = {};
	const totalRefNgramCount: Record<number, number> = {};
	const totalHypNgramCount: Record<number, number> = {};

	for (const order in refNgrams) {
		for (const ngram in hypNgrams[order]) {
			totalHypNgramCount[order] = (totalHypNgramCount[order] || 0) + hypNgrams[order][ngram];
		}

		for (const ngram in refNgrams[order]) {
			totalRefNgramCount[order] = (totalRefNgramCount[order] || 0) + refNgrams[order][ngram];

			if (ngram in hypNgrams[order]) {
				matchingNgramCount[order] =
					(matchingNgramCount[order] || 0) +
					Math.min(refNgrams[order][ngram], hypNgrams[order][ngram]);
			}
		}
	}

	return [matchingNgramCount, totalRefNgramCount, totalHypNgramCount];
}

function ngramPrecrecf(
	matching: Record<number, number>,
	reflen: Record<number, number>,
	hyplen: Record<number, number>,
	beta: number
): Record<number, number> {
	const ngramPrec: Record<number, number> = {};
	const ngramRec: Record<number, number> = {};
	const ngramF: Record<number, number> = {};

	const factor = Math.pow(beta, 2);

	for (const order in matching) {
		if (hyplen[order] > 0) {
			ngramPrec[order] = matching[order] / hyplen[order];
		} else {
			ngramPrec[order] = 1e-16;
		}

		if (reflen[order] > 0) {
			ngramRec[order] = matching[order] / reflen[order];
		} else {
			ngramRec[order] = 1e-16;
		}

		const denom = factor * ngramPrec[order] + ngramRec[order];
		if (denom > 0) {
			ngramF[order] = ((1 + factor) * ngramPrec[order] * ngramRec[order]) / denom;
		} else {
			ngramF[order] = 1e-16;
		}
	}

	return ngramF;
}

export function computeChrF(
	ref: string,
	hyp: string,
	ncorder: number = 6,
	nworder: number = 2,
	beta: number = 2.0
): number {
	const norder = nworder + ncorder;

	// Initialization of document level scores
	const totalMatchingCount: Record<number, number> = {};
	const totalRefCount: Record<number, number> = {};
	const totalHypCount: Record<number, number> = {};
	const totalChrMatchingCount: Record<number, number> = {};
	const totalChrRefCount: Record<number, number> = {};
	const totalChrHypCount: Record<number, number> = {};

	const hypNgramCounts = ngramCounts(separatePunctuation(hyp), nworder);
	const hypChrNgramCounts = ngramCounts(separateCharacters(hyp), ncorder);

	const refNgramCounts = ngramCounts(separatePunctuation(ref), nworder);
	const refChrNgramCounts = ngramCounts(separateCharacters(ref), ncorder);

	// Number of overlapping n-grams, total number of ref n-grams, total number of hyp n-grams
	const [matchingNgramCounts, totalRefNgramCount, totalHypNgramCount] = ngramMatches(
		refNgramCounts,
		hypNgramCounts
	);
	const [matchingChrNgramCounts, totalChrRefNgramCount, totalChrHypNgramCount] = ngramMatches(
		refChrNgramCounts,
		hypChrNgramCounts
	);

	// Collect document level ngram counts
	for (let order = 0; order < nworder; order++) {
		totalMatchingCount[order] =
			(totalMatchingCount[order] || 0) + (matchingNgramCounts[order] || 0);
		totalRefCount[order] = (totalRefCount[order] || 0) + (totalRefNgramCount[order] || 0);
		totalHypCount[order] = (totalHypCount[order] || 0) + (totalHypNgramCount[order] || 0);
	}

	for (let order = 0; order < ncorder; order++) {
		totalChrMatchingCount[order] =
			(totalChrMatchingCount[order] || 0) + (matchingChrNgramCounts[order] || 0);
		totalChrRefCount[order] = (totalChrRefCount[order] || 0) + (totalChrRefNgramCount[order] || 0);
		totalChrHypCount[order] = (totalChrHypCount[order] || 0) + (totalChrHypNgramCount[order] || 0);
	}

	// Total precision, recall, and F (arithmetic mean of all ngrams)
	const totalNgramF = ngramPrecrecf(totalMatchingCount, totalRefCount, totalHypCount, beta);
	const totalChrNgramF = ngramPrecrecf(
		totalChrMatchingCount,
		totalChrRefCount,
		totalChrHypCount,
		beta
	);

	const totalF =
		(Object.values(totalChrNgramF).reduce((a, b) => a + b, 0) +
			Object.values(totalNgramF).reduce((a, b) => a + b, 0)) /
		norder;

	return totalF;
}
