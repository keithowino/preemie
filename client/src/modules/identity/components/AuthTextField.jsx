import { Field, FieldError, FieldLabel } from "@/components/ui/field.jsx";
import { Input } from "@/components/ui/input.jsx";

export default function AuthTextField({
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

						<Input
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
