import { createContext } from "react";

const initialState = {
	theme: "system",
	setTheme: () => null,
};

// const ThemeContext = createContext({ theme: "dark", toggleTheme: () => {} });
const ThemeContext = createContext(initialState);

export default ThemeContext;
