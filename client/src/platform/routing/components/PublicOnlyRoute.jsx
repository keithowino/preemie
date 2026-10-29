import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useIdentity } from "../../identity/index.js";

/**
 * Renders its children only for an unauthenticated user.
 *
 * A signed-in user who lands on a public-only route (login,
 * register) is sent to the form, not the landing page — the
 * form is the authenticated home.
 */
export default function PublicOnlyRoute() {
	const { isAuthenticated, isLoading } = useIdentity();

	const location = useLocation();

	if (isLoading) {
		return null;
	}

	if (isAuthenticated) {
		const state = location.state;

		const destination =
			typeof state?.from?.pathname === "string"
				? state.from.pathname
				: "/create";

		return <Navigate to={destination} replace />;
	}

	return <Outlet />;
}
