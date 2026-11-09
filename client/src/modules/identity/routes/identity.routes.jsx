import { AccountLayout, AuthLayout } from "../layouts/index.js";
import {
	AccountSettingsPage,
	LoginPage,
	ProfilePage,
	RegisterPage,
	SessionsPage,
} from "../pages/index.js";
import { Navigate } from "react-router-dom";

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

/**
 * Bare /account redirects to the profile page.
 */
export const authenticatedIdentityRoutes = [
	{
		path: "/account",
		element: <AccountLayout />,
		children: [
			{
				index: true,
				element: <Navigate to="/account/profile" replace />,
			},
			{
				path: "profile",
				element: <ProfilePage />,
			},
			{
				path: "settings",
				element: <AccountSettingsPage />,
			},
			{
				path: "settings/security",
				element: <SessionsPage />,
			},
		],
	},
];
