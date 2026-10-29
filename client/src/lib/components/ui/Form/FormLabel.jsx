export default function FormLabel({ children, htmlFor, required = false }) {
	return (
		<label
			htmlFor={htmlFor}
			className="block text-sm font-semibold text-graphite"
		>
			{children}

			{required && (
				<span title="Important" className="text-red-500 ml-1">
					*
				</span>
			)}
		</label>
	);
}
