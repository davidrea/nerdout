/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				serif: ['Playfair Display', 'Georgia', 'serif'],
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				// Luxury ink-inspired palette
				ink: {
					50: '#f4f6f9',
					100: '#e8ecf1',
					200: '#d1d9e3',
					300: '#aab8ca',
					400: '#7d92ad',
					500: '#5d7393',
					600: '#4a5c7a',
					700: '#3d4b63',
					800: '#354154',
					900: '#1e3a5f', // Deep midnight blue
				},
				burgundy: {
					50: '#faf5f5',
					100: '#f4e8e8',
					200: '#ead5d5',
					300: '#dbb5b5',
					400: '#c68a8a',
					500: '#b06565',
					600: '#984a4a',
					700: '#7f3d3d',
					800: '#6a3535',
					900: '#5c1a1a', // Rich burgundy
				},
				brass: {
					50: '#fdfbf7',
					100: '#faf6ed',
					200: '#f5ead1',
					300: '#edd9a8',
					400: '#e3c26d',
					500: '#d4a944',
					600: '#b8860b', // Aged brass
					700: '#9a6e0a',
					800: '#7f5a0d',
					900: '#6b4b0e',
				},
				parchment: {
					50: '#fefdfb',
					100: '#faf7f2', // Main background
					200: '#f5f0e8',
					300: '#ebe4d5',
					400: '#ddd2bb',
					500: '#c9b99a',
				},
				charcoal: {
					DEFAULT: '#2d2d2d',
					light: '#4a4a4a',
					lighter: '#6b6b6b',
				}
			}
		}
	},
	plugins: []
};