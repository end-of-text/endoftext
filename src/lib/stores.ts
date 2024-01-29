import { writable, type Writable } from 'svelte/store';
import type { Entry, Prompt } from './types';

export const elementSelection: Writable<boolean> = writable(false);
export const elementsSelected: Writable<Entry[]> = writable([]);
export const selectedPrompt: Writable<Prompt | undefined> = writable(undefined);
