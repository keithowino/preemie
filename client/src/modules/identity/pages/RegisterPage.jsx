// "use client";

import { useState } from "react";
import { useIdentity } from "../../../platform/index.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getDestination, getErrorMessage } from "../utils/index.js";
import { Button } from "@/components/ui/button.jsx";
import { FieldDescription, FieldGroup } from "@/components/ui/field.jsx";
import { useForm } from "@tanstack/react-form";
import { registerFormSchema } from "../validators/authSchema.js";
import AuthTextField from "../components/AuthTextField.jsx";
import FormError from "@/components/ui/custom/FormError.jsx";
import { PhoneInput } from "@/components/ui/phone-input.jsx";

export default function RegisterPage() {
	const { register } = useIdentity();

	const location = useLocation();
	const navigate = useNavigate();

	const [submitError, setSubmitError] = useState(null);

	const form = useForm({
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			password: "",
			confirmPassword: "",
		},

		validators: {
			onSubmit: registerFormSchema,
			onChange: registerFormSchema,
			onBlur: registerFormSchema,
		},

		onSubmit: async ({ value }) => {
			setSubmitError(null);

			try {
				await register({
					firstName: value.firstName.trim(),
					lastName: value.lastName.trim(),
					email: value.email.trim(),
					phone: value.phone.trim(),
					password: value.password,
				});

				navigate(getDestination(location), { replace: true });
			} catch (error) {
				setSubmitError(getErrorMessage(error, "register"));
			}
		},
	});

	return (
		<form
			id="register-user-form"
			noValidate
			onSubmit={(event) => {
				event.preventDefault();
				event.stopPropagation();
				form.handleSubmit();
			}}
		>
			<FieldGroup>
				<div className="grid grid-cols-2 gap-4">
					<AuthTextField
						autoComplete="given-name"
						label="First Name"
						maxLength={50}
						placeholder="John"
						required
						form={form}
						fieldName="firstName"
					/>

					<AuthTextField
						autoComplete="additional-name"
						fieldName="lastName"
						form={form}
						label="Last Name"
						maxLength={50}
						placeholder="Doe"
					/>
				</div>

				<AuthTextField
					autoComplete="email"
					fieldName="email"
					form={form}
					label="Email"
					maxLength={254}
					placeholder="me@example.com"
					required
					type="email"
				/>
				<AuthTextField
					as={PhoneInput}
					// autoComplete="tel"
					fieldName="phone"
					form={form}
					label="Phone"
					// maxLength={30}
					placeholder="+712345678"
					type="tel"
				/>

				<div className="grid grid-cols-2 gap-4">
					<AuthTextField
						autoComplete="new-password"
						fieldName="password"
						form={form}
						label="Password"
						maxLength={128}
						minLength={8}
						required
						type="password"
					/>

					<AuthTextField
						autoComplete="new-password"
						fieldName="confirmPassword"
						form={form}
						label="Confirm Password"
						maxLength={128}
						minLength={8}
						required
						type="password"
					/>
				</div>

				{submitError && (
					<FormError clearError={setSubmitError}>
						{submitError}
					</FormError>
				)}

				<div className="flex flex-col gap-3">
					<form.Subscribe
						selector={(state) => ({
							isSubmitting: state.isSubmitting,
							isValid: state.isValid,
							canSubmit: state.canSubmit,
						})}
					>
						{({ isSubmitting, canSubmit, isValid }) => (
							<Button
								type="submit"
								disabled={isSubmitting}
								className="rounded-md"
							>
								{isSubmitting
									? "Please wait..."
									: "Create account"}
							</Button>
						)}
					</form.Subscribe>

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
				</div>
			</FieldGroup>
		</form>
	);
}
