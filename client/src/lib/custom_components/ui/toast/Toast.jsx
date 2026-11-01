/**
 * One toast.
 *
 * - `role` and `aria-live` depend on the toast kind: errors and warnings
 *   interrupt; info and success wait for a pause.
 * - The whole toast is not a button — that would make the text hard to
 *   select and trap focus incorrectly. Only the dismiss control is
 *   interactive.
 * - Hovering or focusing the toast pauses the auto-dismiss timer.
 */

const STYLES = {
	info: {
		container: "border-blue-200 bg-blue-50 text-blue-900",
		title: "text-blue-900",
		description: "text-blue-800",
		close: "text-blue-700 hover:bg-blue-100",
		icon: "text-blue-700",
	},

	success: {
		container: "border-green-200 bg-green-50 text-green-900",
		title: "text-green-900",
		description: "text-green-800",
		close: "text-green-700 hover:bg-green-100",
		icon: "text-green-700",
	},

	warning: {
		container: "border-amber-200 bg-amber-50 text-amber-900",
		title: "text-amber-900",
		description: "text-amber-800",
		close: "text-amber-700 hover:bg-amber-100",
		icon: "text-amber-700",
	},

	error: {
		container: "border-red-200 bg-red-50 text-red-900",
		title: "text-red-900",
		description: "text-red-800",
		close: "text-red-700 hover:bg-red-100",
		icon: "text-red-700",
	},
};

const ICONS = {
	info: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="10" />
			<line x1="12" y1="16" x2="12" y2="12" />
			<line x1="12" y1="8" x2="12.01" y2="8" />
		</svg>
	),
	success: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M20 6 9 17l-5-5" />
		</svg>
	),
	warning: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
			<line x1="12" y1="9" x2="12" y2="13" />
			<line x1="12" y1="17" x2="12.01" y2="17" />
		</svg>
	),
	error: (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="10" />
			<line x1="15" y1="9" x2="9" y2="15" />
			<line x1="9" y1="9" x2="15" y2="15" />
		</svg>
	),
};

export default function Toast({
	toast,
	onDismiss,
	onPause,
	onResume,
	renderToast,
}) {
	const style = STYLES[toast.kind] ?? STYLES.info;

	const isAssertive = toast.kind === "error" || toast.kind === "warning";

	const role = isAssertive ? "alert" : "status";
	const ariaLive = isAssertive ? "assertive" : "polite";

	function handleMouseEnter() {
		onPause?.(toast.id);
	}

	function handleMouseLeave() {
		onResume?.(toast.id);
	}

	function handleFocus() {
		onPause?.(toast.id);
	}

	function handleBlur(event) {
		// Only resume when focus actually leaves the toast.
		if (!event.currentTarget.contains(event.relatedTarget)) {
			onResume?.(toast.id);
		}
	}

	const content =
		typeof renderToast === "function" ? (
			renderToast({ toast, dismiss: () => onDismiss(toast.id) })
		) : (
			<div className="flex items-start gap-3">
				<span className={`mt-0.5 h-5 w-5 shrink-0 ${style.icon}`}>
					{ICONS[toast.kind] ?? ICONS.info}
				</span>

				<div className="min-w-0 flex-1">
					<p className={`font-semibold ${style.title}`}>
						{toast.message}
					</p>

					{toast.description && (
						<p className={`mt-1 text-sm ${style.description}`}>
							{toast.description}
						</p>
					)}
				</div>

				<button
					type="button"
					onClick={() => onDismiss(toast.id)}
					aria-label="Dismiss notification"
					className={`shrink-0 rounded-control p-1 transition ${style.close}`}
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-4 w-4"
						aria-hidden="true"
					>
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
			</div>
		);

	return (
		<div
			role={role}
			aria-live={ariaLive}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onFocus={handleFocus}
			onBlur={handleBlur}
			className={`pointer-events-auto rounded-card border px-4 py-3 shadow-card ${style.container}`}
		>
			{content}
		</div>
	);
}
