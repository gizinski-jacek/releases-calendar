import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			gridTemplateColumns: {
				'28': 'repeat(28, minmax(0, 1fr))',
			},
			colors: {
				'custom-primary': 'rgb(var(--color-primary) / <alpha-value>)',
				'custom-secondary': 'rgb(var(--color-secondary) / <alpha-value>)',
				'custom-gray': 'rgb(var(--color-gray) / <alpha-value>)',
				'custom-alt-gray': 'rgb(var(--color-alt-gray) / <alpha-value>)',
				'custom-blue': 'rgb(var(--color-blue) / <alpha-value>)',
				'custom-purple': 'rgb(var(--color-purple) / <alpha-value>)',
				'custom-red': 'rgb(var(--color-red) / <alpha-value>)',
			},
		},
	},
	darkMode: ['class'],
	plugins: [],
};
export default config;
