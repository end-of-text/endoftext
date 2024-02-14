import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		csp: {
			directives: {
				'script-src': ['self']
			},
			reportOnly: {
				'script-src': ['self']
			}
		}
	}
};

export default config;
