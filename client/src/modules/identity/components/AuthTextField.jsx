import { Field, FieldError, FieldLabel } from "@/components/ui/field.jsx";
import { Input } from "@/components/ui/input.jsx";

export default function AuthTextField({
	as: Component = Input,
	autoComplete,
	className,
	fieldName,
	form,
	label,
	placeholder,
	required = false,
	type = "text",
	minLength,
	maxLength,
	...inputProps
}) {
	return (
		<form.Field
			name={fieldName}
			children={(field) => {
				const isInvalid =
					field.state.meta.isTouched && !field.state.meta.isValid;

				return (
					<Field data-invalid={isInvalid} className={className}>
						<FieldLabel htmlFor={`auth-${field.name}`}>
							{label}{" "}
							{required && (
								<span className="text-destructive">*</span>
							)}
						</FieldLabel>

						{/* <Input
							id={`auth-${field.name}`}
							name={field.name}
							value={field.state.value}
							type={type}
							placeholder={placeholder}
							autoComplete={autoComplete}
							required={required}
							minLength={minLength}
							maxLength={maxLength}
							onBlur={field.handleBlur}
							onChange={(event) =>
								field.handleChange(event.target.value)
							}
							aria-invalid={isInvalid}
							{...inputProps}
						/> */}

						{/* <Component
							id={`auth-${field.name}`}
							name={field.name}
							value={field.state.value}
							type={type}
							placeholder={placeholder}
							autoComplete={autoComplete}
							required={required}
							minLength={minLength}
							maxLength={maxLength}
							onBlur={field.handleBlur}
							onChange={(event) =>
								field.handleChange(event.target.value)
							}
							aria-invalid={isInvalid}
							{...inputProps}
						/> */}

						<Component
							id={`auth-${field.name}`}
							name={field.name}
							value={field.state.value}
							type={type}
							placeholder={placeholder}
							autoComplete={autoComplete}
							required={required}
							minLength={minLength}
							maxLength={maxLength}
							onBlur={field.handleBlur}
							/** Research what eventOrValue is */
							onChange={(eventOrValue) => {
								/**
								 * Standard inputs emit an event; value-first components (like
								 * the phone input) emit the value itself. Accept both so that
								 * `as={PhoneInput}` and `as={Input}` share one wrapper.
								 */
								const nextValue =
									eventOrValue &&
									typeof eventOrValue === "object" &&
									"target" in eventOrValue
										? eventOrValue.target.value
										: (eventOrValue ?? "");

								field.handleChange(nextValue);
							}}
							aria-invalid={isInvalid}
							{...inputProps}
						/>

						{isInvalid && (
							<FieldError
								id={`${field.name}-error`}
								errors={field.state.meta.errors}
							/>
						)}
					</Field>
				);
			}}
		/>
	);
}
