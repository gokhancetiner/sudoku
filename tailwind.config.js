module.exports = {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				sudoku: {
					light: "#f8fafc",
					dark: "#1e293b",
					border: "#e2e8f0",
					highlight: "#3b82f6",
					error: "#ef4444",
					success: "#10b981",
					hint: "#f59e0b",
				},
			},
			fontFamily: {
				sans: ["system-ui", "sans-serif"],
			},
		},
	},
	plugins: [],
}
