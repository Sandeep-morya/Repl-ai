import { TbMoon, TbSun } from "react-icons/tb";
import useColorMode from "../hooks/useColorMode";

const Navbar = () => {
	const { colorMode, toggleTheme } = useColorMode();

	const text = colorMode === "dark" ? "text-gray-200" : "text-gray-950";

	return (
		<header
			className={`bg-gray px-10 py-4 flex flex-row justify-between items-center`}>
			<div className="flex text-3xl font-bold uppercase tracking-widest">
				<span className={`${text} smooth`}>
					Repl<span className="text-blue-500">ai</span>
				</span>
			</div>
			{colorMode === "dark" ? (
				<TbMoon onClick={toggleTheme} className={`${text} text-2xl smooth`} />
			) : (
				<TbSun onClick={toggleTheme} className={`${text} text-2xl smooth`} />
			)}
		</header>
	);
};

export default Navbar;
