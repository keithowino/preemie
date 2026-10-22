import { Link } from "react-router-dom";
import { platform } from "../../config/index.js";

export default function AppHeader() {
	return (
		<header className="border-b border-border bg-canvas">
			<div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
				<Link
					to="/"
					aria-label="Preemie home"
					className="inline-flex items-center gap-3 rounded-md"
				>
					<span
						aria-hidden="true"
						className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage text-graphite"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-6 w-6"
						>
							<path d="M12 20v-8" />
							<path d="M12 13C5 13 4 7 4 4c6 0 10 3 8 9Z" />
							<path d="M12 16c0-5 3-8 8-8 0 4-2 8-8 8Z" />
						</svg>
					</span>

					<span className="flex flex-col">
						<span className="font-display text-xl font-extrabold leading-tight tracking-tight text-graphite">
							{platform.name}
						</span>
						<span className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted">
							Ideas from what you have
						</span>
					</span>
				</Link>

				<span className="hidden text-sm font-medium text-muted sm:block">
					Make. Test. Improve.
				</span>
			</div>
		</header>
	);
}
