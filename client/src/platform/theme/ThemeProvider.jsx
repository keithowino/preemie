import { useEffect, useState } from "react";
import ThemeContext from "./ThemeContext.jsx";

/**
 * Local theme state, persisted to localStorage and reflected as the
 * `dark` class on <html>.
 *
 * TODO: Handle "system" properly — react to `prefers-color-scheme`
 * changes while the page is open, not only at mount.
 */

function readStoredTheme(storageKey, defaultTheme) {
	if (typeof window === "undefined") {
		return "system";
	}
	const stored = window.localStorage.getItem(storageKey);
	return stored === "light" || stored === "dark" || stored === "system"
		? stored
		: defaultTheme;
}

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "preemie-ui-theme",
	...props
}) {
	const [theme, setTheme] = useState(
		readStoredTheme(storageKey, defaultTheme),
	);

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove("light", "dark");

		if (theme === "system") {
			const systemTheme = window.matchMedia(
				"(prefers-color-scheme: dark)",
			).matches
				? "dark"
				: "light";

			root.classList.add(systemTheme);
			return;
		}

		root.classList.add(theme);
	}, [theme]);

	const value = {
		theme,
		setTheme: (theme) => {
			localStorage.setItem(storageKey, theme);
			setTheme(theme);
		},
	};

	return (
		<ThemeContext.Provider {...props} value={value}>
			{children}
		</ThemeContext.Provider>
	);
}
