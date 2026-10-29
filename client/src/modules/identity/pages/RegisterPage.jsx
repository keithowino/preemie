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
