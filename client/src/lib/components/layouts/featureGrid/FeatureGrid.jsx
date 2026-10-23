export default function FeatureGrid({ children, columns = 3, className }) {
	const columnLayouts = {
		1: "grid-cols-1",
		2: "grid-cols-1 sm:grid-cols-2",
		3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
		4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
	};

	const gridCols = columnLayouts[columns] ?? columnLayouts[3];

	return (
		<div className={`grid gap-4 md:gap-6 ${gridCols} ${className}`}>
			{children}
		</div>
	);
}
