import { Navigate, useRoutes } from "react-router-dom";
import {
	authenticatedIdentityRoutes,
	gatewayRoutes,
	ideationRoutes,
	publicIdentityRoutes,
} from "../../modules/index.js";
import { AuthenticatedRoute, PublicOnlyRoute } from "../../platform/index.js";

/**
 * React Query will manage asynchronous query states,
 * but it does not replace route-level error handling.
 *
 * When we implement the routes, React Router's errorElement
 * or equivalent route error-boundary mechanism can handle
 * unexpected route errors. Expected API failures should remain
 * within the relevant page so that users can retry without
 * losing their context.
 */

function ApplicationRoutes() {
	return useRoutes([
		...gatewayRoutes,
		{
			element: <PublicOnlyRoute />,
			children: publicIdentityRoutes,
		},

		{
			element: <AuthenticatedRoute />,
			children: [...ideationRoutes, ...authenticatedIdentityRoutes],
		},
		{
			path: "*",
			element: <Navigate to="/" replace />,
		},
	]);
}

export default function RouterConfiguration() {
	return <ApplicationRoutes />;
}
