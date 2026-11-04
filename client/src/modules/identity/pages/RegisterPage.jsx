import { useState } from "react";
import { FormError } from "../../../lib/index.js";
import { useIdentity } from "../../../platform/index.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getDestination, getErrorMessage } from "../utils.js";
import { Button } from "@/components/ui/button.jsx";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field.jsx";
import { Input } from "@/components/ui/input.jsx";

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
		<form onSubmit={handleSubmit} noValidate>
			<FieldGroup>
				<Field className="grid grid-cols-2 gap-4">
					<Field>
						<FieldLabel htmlFor="signup-first-name">
							First Name{" "}
							<span className="text-destructive">*</span>
						</FieldLabel>
						<Input
							id="signup-first-name"
							name="firstName"
							type="text"
							placeholder="John"
							autoComplete="given-name"
							required
							maxLength={50}
							value={firstName}
							onChange={(event) =>
								setFirstName(event.target.value)
							}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="signup-last-name">
							Last Name
						</FieldLabel>
						<Input
							id="signup-last-name"
							name="lastName"
							type="text"
							placeholder="Doe"
							required
							autoComplete="additional-name"
							maxLength={50}
							value={lastName}
							onChange={(event) =>
								setLastName(event.target.value)
							}
						/>
					</Field>
				</Field>
				<Field>
					<FieldLabel htmlFor="signup-email">
						Email <span className="text-destructive">*</span>
					</FieldLabel>
					<Input
						id="signup-email"
						type="email"
						placeholder="me@example.com"
						autoComplete="email"
						required
						maxLength={254}
						value={email}
						onChange={(event) => setEmail(event.target.value)}
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor="signup-phone">Phone</FieldLabel>
					<Input
						id="signup-phone"
						placeholder="+254 712 345 678"
						type="tel"
						autoComplete="tel"
						maxLength={30}
						value={phone}
						onChange={(event) => setPhone(event.target.value)}
					/>
				</Field>
				<Field>
					<Field className="grid grid-cols-2 gap-4">
						<Field>
							<FieldLabel htmlFor="signup-password">
								Password{" "}
								<span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								id="signup-password"
								type="password"
								autoComplete="new-password"
								required
								minLength={8}
								maxLength={128}
								value={password}
								onChange={(event) =>
									setPassword(event.target.value)
								}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="signup-signup-confirm-password">
								Confirm Password{" "}
								<span className="text-destructive">*</span>
							</FieldLabel>
							<Input
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
						</Field>
					</Field>
					<FieldDescription>
						Must be at least 8 characters long.
					</FieldDescription>
				</Field>

				{feedback && (
					<FormError clearError={setFeedback}>
						{feedback.message}
					</FormError>
				)}

				<Field>
					<Button
						type="submit"
						disabled={isSubmitting}
						className="rounded-md"
					>
						{isSubmitting ? "Please wait..." : "Create account"}
					</Button>
					<FieldDescription className="text-center">
						Already have an account?
						<Link
							to="/login"
							state={{ from: location.state?.from }}
							className="font-semibold text-graphite underline underline-offset-4"
						>
							Sign in
						</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	);
};

export default RegisterPage;
