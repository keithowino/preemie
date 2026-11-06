import { useContext } from "react";
import ThemeContext from "./ThemeContext.jsx";

export const useTheme = () => {
	const ctx = useContext(ThemeContext);
	if (!ctx) {
		throw new Error("useTheme must be used within an ThemeProvider");
	}
	return ctx;
};
