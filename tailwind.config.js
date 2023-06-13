/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./content/**/*.{md,mdx}",
		"./components/**/*.tsx"
	],
	theme: {
		container: {
			center: true
		},
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
		},
	},
	variants: {
		extend: {
			display: ["group-hover"]
		}
	},
	plugins: [],
};
