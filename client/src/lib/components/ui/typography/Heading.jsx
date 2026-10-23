const levels = {
	1: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold",
	2: "text-2xl sm:text-3xl font-bold",
	3: "text-xl sm:text-2xl font-semibold",
	4: "text-lg sm:text-xl font-semibold",
	5: "text-sm sm:text-lg font-semibold",
};

export default function Heading({
	level = 2,
	className = "",
	children,
	...props
}) {
	const Component = `h${level}`;

	return (
		<Component
			className={[
				"my-4 sm:my-6 text-balance leading-tight",
				levels[level],
				className,
			].join(" ")}
			{...props}
		>
			{children}
		</Component>
	);
}
