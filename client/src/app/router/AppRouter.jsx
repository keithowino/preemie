import { BrowserRouter } from "react-router-dom";
import RouterConfiguration from "./RouteConfiguration.jsx";
import { AppShell, ScrollToTop } from "../../lib/index.js";

export function AppRouter() {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<AppShell>
				<RouterConfiguration />
			</AppShell>
		</BrowserRouter>
	);
}
