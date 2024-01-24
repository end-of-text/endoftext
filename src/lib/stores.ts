import { writable, type Writable } from 'svelte/store';
import type { Entry } from './types';

export const elementSelection: Writable<boolean> = writable(false);
export const elementsSelected: Writable<Entry[]> = writable([]);
