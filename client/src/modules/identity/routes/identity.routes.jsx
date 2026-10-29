import { AuthLayout } from "../layouts/index.js";
import { LoginPage, RegisterPage, SessionsPage } from "../pages/index.js";

export const publicIdentityRoutes = [
	{
		element: <AuthLayout />,
		children: [
			{
				path: "/login",
				element: <LoginPage />,
			},
			{
				path: "/register",
				element: <RegisterPage />,
			},
		],
	},
];

export const authenticatedIdentityRoutes = [
	{
		path: "/sessions",
		element: <SessionsPage />,
	},
];
