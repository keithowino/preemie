export default function Form({ children, className = "", onSubmit, ...props }) {
	return (
		<form
			onSubmit={onSubmit}
			className={`space-y-6 rounded-md border border-border bg-white p-5 sm:p-6 ${className}`}
			{...props}
		>
			{children}
		</form>
	);
}
