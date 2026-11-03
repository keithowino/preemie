import { platform } from "../../../lib/index.js";

export default function AppFooter() {
	return (
		<footer className="border-t border-border bg-background">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
				<p>
					{platform.name} — {platform.description}
				</p>

				<p>{platform.excerpt}</p>
			</div>
		</footer>
	);
}
