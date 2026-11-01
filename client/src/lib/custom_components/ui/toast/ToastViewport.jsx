import Toast from "./Toast.jsx";

/**
 * Fixed-position stack of toasts.
 *
 * Layout:
 *   - Anchored to the top-right of the viewport on desktop.
 *   - Anchored to the bottom on small screens, where a top-right
 *     stack would collide with the mobile browser chrome.
 *
 * Accessibility:
 *   - `aria-live="polite"` provides a fallback announcement path for
 *     assistive technologies that do not implement `role="status"` on
 *     individual toasts.
 *   - `aria-relevant="additions"` avoids re-reading the whole stack
 *     when one toast dismisses.
 */
export default function ToastViewport({
	toasts,
	onDismiss,
	onPause,
	onResume,
	renderToast,
}) {
	if (toasts.length === 0) {
		return null;
	}

	return (
		<div
			aria-live="polite"
			aria-relevant="additions"
			aria-label="Notifications"
			className="pointer-events-none fixed inset-x-3 bottom-3 z-50 flex flex-col gap-2 sm:inset-x-auto sm:right-4 sm:top-4 sm:bottom-auto sm:w-full sm:max-w-sm"
		>
			{toasts.map((toast) => (
				<Toast
					key={toast.id}
					toast={toast}
					onDismiss={onDismiss}
					onPause={onPause}
					onResume={onResume}
					renderToast={renderToast}
				/>
			))}
		</div>
	);
}
