import type { Entry } from './entries';

// TODO: use real database
const db = new Map<string, Entry[]>();

export function getEntries(userId: string) {
	if (!db.get(userId)) {
		db.set(userId, [
			{
				id: crypto.randomUUID(),
				text: 'First Entry'
			} as Entry
		]);
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
