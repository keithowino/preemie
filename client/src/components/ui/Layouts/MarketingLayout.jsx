import { Outlet } from "react-router-dom";
import AppFooter from "./AppFooter.jsx";
import AppHeader from "./AppHeader.jsx";

/**
 * Public-facing shell: header + page content + footer.
 * Pages render their own <Container>, so <main> adds no padding.
 * Used by the landing page and (for now) the login/register routes.
 */
export default function MarketingLayout() {
	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			<AppHeader />

			<main id="main-content" className="flex-1">
				<Outlet />
			</main>

			<AppFooter />
		</div>
	);
}
