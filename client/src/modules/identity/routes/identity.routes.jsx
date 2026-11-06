import { AuthLayout } from "../layouts/index.js";
import {
	AccountSettingsPage,
	LoginPage,
	ProfilePage,
	RegisterPage,
	SessionsPage,
} from "../pages/index.js";

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
		path: "/account/profile",
		element: <ProfilePage />,
	},
	{
		path: "/account/settings",
		element: <AccountSettingsPage />,
	},
	{
		path: "/account/settings/security",
		element: <SessionsPage />,
	},
];
