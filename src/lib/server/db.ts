import type { Entry } from '../types';

// TODO: use real database
const db = new Map<string, Entry[]>();

export function getEntries(userId: string) {
	if (!db.get(userId)) {
		db.set(userId, []);
	}

	return db.get(userId);
}

export function createEntry(userId: string, text: string) {
	const entries = db.get(userId);

	if (!entries) {
		throw new Error('User not found');
	}

	entries.push({
		id: crypto.randomUUID(),
		text
	} as Entry);
}

export function deleteEntry(userId: string, entryId: string) {
	const entries = db.get(userId);

	if (!entries) {
		throw new Error('User not found');
	}

	const index = entries.findIndex((entry) => entry.id === entryId);

	if (index === -1) {
		throw new Error('Entry not found');
	}

	entries.splice(index, 1);
}
