import type { Tables } from './supabase';

export function filterSuggestions(
	suggestions: Tables<'suggestions'>[] | undefined,
	selectedSpan: { start: number; end: number } | undefined
): Tables<'suggestions'>[] | undefined {
	if (suggestions === undefined) return undefined;
	if (selectedSpan) {
		return suggestions.filter((s) =>
			s.target_spans?.some((s) => s[0] >= selectedSpan.start && s[1] <= selectedSpan.end)
		);
	}
	return suggestions;
}
