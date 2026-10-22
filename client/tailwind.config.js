/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],

	theme: {
		extend: {
			colors: {
				canvas: "var(--color-canvas)",
				sage: "var(--color-sage)",
				signal: "var(--color-signal)",
				graphite: "var(--color-graphite)",
				surface: "var(--color-surface)",
				border: "var(--color-border)",
				muted: "var(--color-muted)",
			},

			fontFamily: {
				sans: ["Inter", "system-ui", "sans-serif"],
				display: ["Manrope", "Inter", "sans-serif"],
			},
		},
	},

	plugins: [],
};
