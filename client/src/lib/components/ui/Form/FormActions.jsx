export default function FormActions({ children, className = "" }) {
	return (
		<div
			className={`flex max-sm:flex-wrap items-center justify-end gap-3 pt-2 ${className}`}
		>
			{children}
		</div>
	);
}
