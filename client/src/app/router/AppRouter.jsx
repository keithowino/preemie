import { BrowserRouter } from "react-router-dom";
import RouterConfiguration from "./RouteConfiguration.jsx";
import ScrollToTop from "@/components/custom/layout/ScrollToTop.jsx";
import AppShell from "@/components/ui/Layouts/AppShell.jsx";

export function AppRouter() {
	return (
		<BrowserRouter>
			{/* <ScrollToTop />
			<AppShell>
				<RouterConfiguration />
			</AppShell> */}
			<RouterConfiguration />
		</BrowserRouter>
	);
}
