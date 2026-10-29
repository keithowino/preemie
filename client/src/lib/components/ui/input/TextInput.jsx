export default function TextInput({ className = "", ...props }) {
	return (
		<input
			className={`mt-1 w-full rounded-control border border-border bg-white px-3 py-2.5 text-graphite placeholder:text-muted/70 focus:border-signal focus:outline-none ${className}`}
			{...props}
		/>
	);
}
