import { SignupForm } from "@/components/signup-form.jsx";
import { AuthLayout } from "../layouts/index.js";
import { LoginPage, RegisterPage, SessionsPage } from "../pages/index.js";
import SignupDummy from "@/components/ui/Layouts/manual_code/SignupDummy.jsx";
import SignInDummy from "@/components/ui/Layouts/manual_code/SignInDummy.jsx";

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

// export const publicIdentityRoutes = [
// 	{
// 		path: "/login",
// 		element: <SignInDummy />,
// 	},
// 	{
// 		path: "/register",
// 		element: <SignupDummy />,
// 	},
// ];

export const authenticatedIdentityRoutes = [
	{
		path: "/account/settings/security",
		element: <SessionsPage />,
	},
];
