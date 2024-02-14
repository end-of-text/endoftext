/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#FF7878'
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
};
