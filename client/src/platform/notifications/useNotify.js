import { useContext } from "react";

import NotificationContext from "./NotificationContext.jsx";

/**
 * Access the notification API.
 *
 * Usage:
 *
 *   const notify = useNotify();
 *
 *   notify.success("Saved.");
 *   notify.error("Couldn't save.", { description: "Check your connection." });
 *   notify.info("Heads up.", { duration: 8000 });
 *   notify.warning("Slow down.");
 *   notify.dismiss(toastId);
 *   notify.clear();
 *
 * Every `notify.<kind>` call returns the toast id, so you can dismiss
 * a specific toast later if you need to.
 */
export function useNotify() {
	const ctx = useContext(NotificationContext);

	if (!ctx) {
		throw new Error("useNotify must be used within NotificationProvider.");
	}

	return ctx;
}
