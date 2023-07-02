import {
	useState,
	useEffect,
	useCallback,
	createContext,
	Dispatch,
	PropsWithChildren,
	SetStateAction,
} from "react";

type ColorModes = "light" | "dark";
interface ThemeContextProps {
	colorMode: ColorModes;
	setColorMode: Dispatch<SetStateAction<ColorModes>>;
	toggleTheme: () => void;
}
export const ThemeContext = createContext({} as ThemeContextProps);

const Key = "color-mode";

const mode = (localStorage.getItem(Key) as ColorModes) ?? "light";

const ThemeContextProvider = ({ children }: PropsWithChildren) => {
	const [colorMode, setColorMode] = useState(mode);

	const toggleTheme = useCallback(() => {
		setColorMode((mode) => (mode === "light" ? "dark" : "light"));
	}, []);

	useEffect(() => {
		localStorage.setItem(Key, colorMode);
	}, [colorMode]);

	return (
		<ThemeContext.Provider value={{ colorMode, setColorMode, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export default ThemeContextProvider;
