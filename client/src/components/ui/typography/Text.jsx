export function Text({
	children,
	className = "",
	size = "text-sm sm:text-base",
	...props
}) {
	return (
		<p
			className={[
				size,
				"text-muted-foreground leading-relaxed",
				className,
			].join(" ")}
			{...props}
		>
			{children}
		</p>
	);
}
