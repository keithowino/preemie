import { BrowserRouter } from "react-router-dom";
import RouterConfiguration from "./RouteConfiguration.jsx";
import ScrollToTop from "@/components/custom/layout/ScrollToTop.jsx";

export function AppRouter() {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<RouterConfiguration />
		</BrowserRouter>
	);
}
