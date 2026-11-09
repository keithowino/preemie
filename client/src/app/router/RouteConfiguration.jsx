import { Navigate, useRoutes } from "react-router-dom";
import {
	authenticatedIdentityRoutes,
	gatewayRoutes,
	publicIdentityRoutes,
} from "../../modules/index.js";
import { AuthenticatedRoute, PublicOnlyRoute } from "../../platform/index.js";
import { labRoutes } from "@/modules/administration/index.js";
import {
	MarketingLayout,
	WorkspaceLayout,
} from "@/components/ui/Layouts/index.js";
import workspaceRoutes from "@/modules/workspace/routes/workspace.routes.jsx";

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
		{
			element: <MarketingLayout />,
			children: [
				...gatewayRoutes,
				{
					element: <PublicOnlyRoute />,
					children: publicIdentityRoutes,
				},
			],
		},
		{
			element: <AuthenticatedRoute />,
			children: [
				{
					element: <WorkspaceLayout />,
					children: [
						...workspaceRoutes,
						...authenticatedIdentityRoutes,
					],
				},
				...labRoutes, // Dev testing interface
			],
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
