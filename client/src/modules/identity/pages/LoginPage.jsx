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
