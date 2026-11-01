import { useCallback, useMemo, useRef, useState } from "react";

import NotificationContext from "./NotificationContext.jsx";

import { ToastViewport } from "../../lib/index.js";

/**
 * Default lifetime, in milliseconds, for each notification kind.
 * Callers can override per-toast via `{ duration }`.
 */
const DEFAULT_DURATIONS = {
	info: 5000,
	success: 4000,
	warning: 7000,
	error: 8000,
};

/** Absolute bounds so a caller can't accidentally create a stuck or invisible toast. */
const MIN_DURATION = 1000;
const MAX_DURATION = 30000;

/** Defense-in-depth cap: a runaway loop shouldn't be able to brick the viewport. */
const MAX_VISIBLE = 5;

let toastCounter = 0;

function nextToastId() {
	toastCounter += 1;
	return `toast-${Date.now().toString(36)}-${toastCounter}`;
}

function clampDuration(value, fallback) {
	if (typeof value !== "number" || !Number.isFinite(value)) {
		return fallback;
	}

	return Math.min(Math.max(value, MIN_DURATION), MAX_DURATION);
}

/**
 * Notification provider.
 *
 * Renders the toast viewport as a sibling of `children` so that calls to
 * `notify.error(...)` from any descendant render into a fixed layer that
 * is not constrained by the caller's DOM position.
 *
 * `renderToast` lets the app substitute a different toast body without
 * touching the provider — useful if you later want a toast that supports
 * an "action" button or a link.
 */
export function NotificationProvider({ children, renderToast }) {
	const [toasts, setToasts] = useState([]);

	/**
	 * Latest callbacks per toast id, so a paused toast can resume its
	 * timer without the provider storing timers in React state.
	 * (Timers are side effects; state is for render.)
	 */
	const timersRef = useRef(new Map());

	const removeToast = useCallback((id) => {
		setToasts((current) => current.filter((toast) => toast.id !== id));

		const timer = timersRef.current.get(id);

		if (timer) {
			clearTimeout(timer);
			timersRef.current.delete(id);
		}
	}, []);

	const scheduleRemoval = useCallback(
		(toast) => {
			if (!toast.duration || toast.duration <= 0) {
				return;
			}

			const timer = setTimeout(() => {
				removeToast(toast.id);
			}, toast.duration);

			timersRef.current.set(toast.id, timer);
		},
		[removeToast],
	);

	const clearTimer = useCallback((id) => {
		const timer = timersRef.current.get(id);

		if (timer) {
			clearTimeout(timer);
			timersRef.current.delete(id);
		}
	}, []);

	/**
	 * Core push. All `notify.<kind>(...)` calls funnel through here.
	 *
	 * Returning the id lets a caller correlate a specific toast with a
	 * later `dismiss` call, which is useful when a request's lifecycle
	 * outlives the initial notification (e.g., "uploading..." -> "done").
	 */
	const push = useCallback(
		(kind, message, options = {}) => {
			if (typeof message !== "string" || message.trim().length === 0) {
				// A silent no-op is worse than a visible failure for a
				// developer mistake; throw so it shows up in tests.
				throw new Error(
					"Notification message must be a non-empty string.",
				);
			}

			const duration = clampDuration(
				options.duration,
				DEFAULT_DURATIONS[kind] ?? DEFAULT_DURATIONS.info,
			);

			const id = options.id ?? nextToastId();

			const toast = {
				id,
				kind,
				message: message.trim(),
				description:
					typeof options.description === "string"
						? options.description
						: null,
				duration,
				createdAt: Date.now(),
			};

			setToasts((current) => {
				// Replace a toast with the same id (useful for "loading" ->
				// "success" transitions without the stack jumping).
				const withoutExisting = current.filter(
					(existing) => existing.id !== id,
				);

				const next = [...withoutExisting, toast];

				// Cap visible toasts. Drop the oldest overflow, and clear
				// its pending timer so it doesn't try to remove a toast
				// that is no longer in state.
				if (next.length > MAX_VISIBLE) {
					const overflow = next.slice(0, next.length - MAX_VISIBLE);

					overflow.forEach((entry) => clearTimer(entry.id));

					return next.slice(next.length - MAX_VISIBLE);
				}

				return next;
			});

			scheduleRemoval(toast);

			return id;
		},
		[scheduleRemoval, clearTimer],
	);

	const dismiss = useCallback(
		(id) => {
			removeToast(id);
		},
		[removeToast],
	);

	const clear = useCallback(() => {
		setToasts((current) => {
			current.forEach((toast) => clearTimer(toast.id));
			return [];
		});
	}, [clearTimer]);

	// Pause/resume hooks handed to the toast viewport. They mutate timers
	// imperatively rather than via state so a hover doesn't cause a
	// re-render of the provider (and therefore of every consumer).
	const pause = useCallback(
		(id) => {
			clearTimer(id);
		},
		[clearTimer],
	);

	const resume = useCallback(
		(id) => {
			const toast = toasts.find((entry) => entry.id === id);

			if (toast) {
				scheduleRemoval(toast);
			}
		},
		[toasts, scheduleRemoval],
	);

	const value = useMemo(
		() => ({
			info: (message, options) => push("info", message, options),
			success: (message, options) => push("success", message, options),
			warning: (message, options) => push("warning", message, options),
			error: (message, options) => push("error", message, options),
			push,
			dismiss,
			clear,
		}),
		[push, dismiss, clear],
	);

	return (
		<NotificationContext.Provider value={value}>
			{children}

			<ToastViewport
				toasts={toasts}
				onDismiss={dismiss}
				onPause={pause}
				onResume={resume}
				renderToast={renderToast}
			/>
		</NotificationContext.Provider>
	);
}

export default NotificationProvider;
