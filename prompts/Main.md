### Phase 9 — Identity domain integration

- [x] Registration, login, refresh, and logout endpoints.
- [x] Current-user endpoint.
- [x] Session listing and individual/other-session revocation endpoints.
- [x] Access-token middleware with server-side session validation.
- [x] Password hashing and hashed refresh-token storage.
- [x] Client authentication provider composed into `AppProviders`.
- [x] Login and registration screens.
- [ ] Session lifecycle and protected-route behavior.
- [ ] Session-management UI.
- [ ] Ownership enforcement for generations and workspace data.
- [ ] Tests for authenticated and unauthorized access to owned resources.

The login and registration screens have been implemented:

```text
\client\src\modules\identity\routes\identity.routes.jsx
```

```jsx
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
```

```text
~\client\src\modules\identity\layouts\AuthLayout.jsx
```

```jsx
import { Link, Outlet, useLocation } from "react-router-dom";
import {
	Container,
	Heading,
	Loader,
	MetaDataInsert,
	platform,
	Section,
	Text,
} from "../../../lib/index.js";
import { useIdentity } from "../../../platform/index.js";

const AuthLayout = () => {
	const { isLoading } = useIdentity();

	const location = useLocation();

	const isRegistering = location.pathname === "/register";

	if (isLoading) {
		return (
			<>
				<MetaDataInsert title="Loading session..." />

				<Container>
					<Loader type="page" msg="Checking your session..." />
				</Container>
			</>
		);
	}

	return (
		<>
			<MetaDataInsert
				title={`${isRegistering ? "Create account" : "Log in"}`}
			/>

			<Container>
				<Section className="mx-auto max-w-lg rounded-card border border-border bg-white p-6 sm:p-9">
					<Text className="font-semibold uppercase tracking-[0.14em]">
						{platform.name}
					</Text>
					<Heading level={1}>
						{isRegistering ? "Create your account" : "Welcome back"}
					</Heading>

					<Text className="mt-2">
						{isRegistering
							? "Create an account to generate ideas and access your saved results."
							: "Log in to continue working with your saved ideations."}
					</Text>

					<Outlet />

					<Text className="mt-6">
						{isRegistering
							? "Already have an account? "
							: "Don't have an account yet? "}

						<Link
							to={isRegistering ? "/login" : "/register"}
							state={{ from: location.state?.from }}
							className="font-semibold text-graphite underline underline-offset-4"
						>
							{isRegistering ? "Log in" : "Create one"}
						</Link>
					</Text>
				</Section>
			</Container>
		</>
	);
};

export default AuthLayout;
```

```text
~\client\src\modules\identity\pages\LoginPage.jsx
```

```jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useIdentity } from "../../../platform/index.js";

import {
	Button,
	FeatureGrid,
	Form,
	FormActions,
	FormError,
	FormField,
	FormInput,
	FormLabel,
} from "../../../lib/index.js";
import { getDestination, getErrorMessage } from "../utils.js";

export default function LoginPage() {
	const { login } = useIdentity();

	const navigate = useNavigate();
	const location = useLocation();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [feedback, setFeedback] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(event) {
		event.preventDefault();

		if (isSubmitting) return;

		setIsSubmitting(true);
		setFeedback(null);

		try {
			await login({ email: email.trim(), password });

			navigate(getDestination(location), { replace: true });
		} catch (error) {
			setFeedback({
				type: "error",
				message: getErrorMessage(error, "login"),
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Form onSubmit={handleSubmit} noValidate>
			<FeatureGrid columns={1}>
				<FormField>
					<FormLabel htmlFor="login-email" required>
						Email address
					</FormLabel>
					<FormInput
						id="login-email"
						type="email"
						autoComplete="email"
						required
						maxLength={254}
						value={email}
						onChange={(event) => setEmail(event.target.value)}
					/>
				</FormField>
				<FormField>
					<FormLabel htmlFor="login-password" required>
						Password
					</FormLabel>
					<FormInput
						id="login-password"
						type="password"
						autoComplete="current-password"
						required
						value={password}
						onChange={(event) => setPassword(event.target.value)}
					/>
				</FormField>
			</FeatureGrid>

			{feedback && (
				<FormError clearError={setFeedback}>
					{feedback.message}
				</FormError>
			)}

			<FormActions>
				<Button
					type="submit"
					disabled={isSubmitting}
					variant="secondary"
					className="rounded-control"
					fullWidthMobile
				>
					{isSubmitting ? "Please wait..." : "Log in"}
				</Button>
			</FormActions>
		</Form>
	);
}
```

```text
~\client\src\modules\identity\utils.js
```

```js
export function getErrorMessage(error, mode) {
	if (error?.status === 400) {
		return (
			error.message || "Check the information you entered and try again."
		);
	}

	if (error?.status === 401) {
		return mode === "login"
			? "The email or password is incorrect."
			: "We couldn't complete registration with those details.";
	}

	if (error?.status === 409) {
		return "An account with those details may already exist.";
	}

	if (error?.code === "NETWORK_ERROR") {
		return "We couldn't connect to the server. Check your connection and try again.";
	}

	if (error?.status >= 500) {
		return "The service is temporarily unavailable. Please try again.";
	}

	return error?.message || "Something went wrong. Please try again.";
}

export function getDestination(location) {
	const from = location.state?.from;

	if (
		!from?.pathname ||
		from.pathname === "/login" ||
		from.pathname === "/register"
	) {
		return "/create";
	}

	return `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`;
}
```

```text
~\client\src\modules\identity\pages\RegisterPage.jsx
```

```jsx
import { useState } from "react";
import {
	Button,
	FeatureGrid,
	Form,
	FormActions,
	FormError,
	FormField,
	FormInput,
	FormLabel,
} from "../../../lib/index.js";
import { useIdentity } from "../../../platform/index.js";
import { useLocation, useNavigate } from "react-router-dom";
import { getDestination, getErrorMessage } from "../utils.js";

const RegisterPage = () => {
	const { isAuthenticated, register } = useIdentity();

	const location = useLocation();
	const navigate = useNavigate();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [feedback, setFeedback] = useState(null);

	const [isSubmitting, setIsSubmitting] = useState(false);

	if (isAuthenticated) {
		return navigate(getDestination(location), { replace: true });
	}

	async function handleSubmit(event) {
		event.preventDefault();

		if (isSubmitting) return;

		setIsSubmitting(true);
		setFeedback(null);

		if (password !== confirmPassword) {
			setFeedback({ type: "error", message: "Passwords do not match." });

			return;
		}

		try {
			await register({
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				email: email.trim(),
				phone: phone.trim(),
				password,
			});

			navigate(getDestination(location), { replace: true });
		} catch (error) {
			setFeedback({
				type: "error",
				message: getErrorMessage(error, "register"),
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Form onSubmit={handleSubmit} noValidate>
			<FeatureGrid columns={1}>
				<FormField>
					<FormLabel htmlFor="signup-first-name" required>
						First Name
					</FormLabel>
					<FormInput
						id="signup-first-name"
						name="firstName"
						type="text"
						autoComplete="given-name"
						required
						maxLength={50}
						value={firstName}
						onChange={(event) => setFirstName(event.target.value)}
					/>
				</FormField>
				<FormField>
					<FormLabel htmlFor="signup-first-name">Last Name</FormLabel>
					<FormInput
						id="signup-last-name"
						name="lastName"
						type="text"
						autoComplete="additional-name"
						maxLength={50}
						value={lastName}
						onChange={(event) => setLastName(event.target.value)}
					/>
				</FormField>
				<FormField>
					<FormLabel htmlFor="signup-email" required>
						Email address
					</FormLabel>
					<FormInput
						id="signup-email"
						type="email"
						autoComplete="email"
						required
						maxLength={254}
						value={email}
						onChange={(event) => setEmail(event.target.value)}
					/>
				</FormField>
				<FormField>
					<FormLabel htmlFor="signup-phone">Phone Number</FormLabel>
					<FormInput
						id="signup-phone"
						type="tel"
						autoComplete="tel"
						maxLength={30}
						value={phone}
						onChange={(event) => setPhone(event.target.value)}
					/>
				</FormField>
				<FormField>
					<FormLabel htmlFor="signup-password" required>
						Password
					</FormLabel>
					<FormInput
						id="signup-password"
						type="password"
						autoComplete="new-password"
						required
						minLength={8}
						maxLength={128}
						value={password}
						onChange={(event) => setPassword(event.target.value)}
					/>
				</FormField>
				<FormField>
					<FormLabel htmlFor="signup-confirm-password" required>
						Confirm Password
					</FormLabel>
					<FormInput
						id="signup-confirm-password"
						type="password"
						autoComplete="new-password"
						required
						minLength={8}
						maxLength={128}
						value={confirmPassword}
						onChange={(event) =>
							setConfirmPassword(event.target.value)
						}
					/>
				</FormField>
			</FeatureGrid>

			{feedback && (
				<FormError clearError={setFeedback}>
					{feedback.message}
				</FormError>
			)}

			<FormActions>
				<Button
					type="submit"
					disabled={isSubmitting}
					variant="secondary"
					className="rounded-control"
					fullWidthMobile
				>
					{isSubmitting ? "Please wait..." : "Create account"}
				</Button>
			</FormActions>
		</Form>
	);
};

export default RegisterPage;
```

---

Now we may proceed to the next step. Session lifecycle, protected-route behavior and session-management UI.
