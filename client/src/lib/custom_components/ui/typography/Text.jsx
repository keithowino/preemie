export default function Text({
	children,
	className = "",
	size = "text-sm sm:text-base",
	...props
}) {
	return (
		<p
			className={[size, "text-muted leading-relaxed", className].join(
				" ",
			)}
			{...props}
		>
			{children}
		</p>
	);
}
