// const colors = require('tailwindcss/colors');
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#FF7878',
				gray: {
					inactive: colors.gray[300],
					active: colors.gray[500],
					hovered: colors.gray[900]
				}
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
};
