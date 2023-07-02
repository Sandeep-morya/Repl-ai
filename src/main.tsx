import "regenerator-runtime/runtime";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ThemeContextProvider from "./provider/ThemeContextProvider.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<ThemeContextProvider>
		<App />
	</ThemeContextProvider>,
);
