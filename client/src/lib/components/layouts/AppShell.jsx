import AppFooter from "./AppFooter.jsx";
import AppHeader from "./AppHeader.jsx";

export default function AppShell({ children }) {
	return (
		<div className="flex min-h-screen flex-col bg-canvas text-graphite">
			<AppHeader />

			<main
				id="main-content"
				className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
			>
				{children}
			</main>

			<AppFooter />
		</div>
	);
}
