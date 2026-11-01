import { FeatureGrid } from "./layouts/index.js";
import { Button, Heading, Section, Text } from "./ui/index.js";

/**
 * Attributes: actions={[{ label: "", action: loadSessions, variant: "" }]}
 */
const EmptyState = ({ label = "No data available.", description, actions }) => {
	return (
		<Section className="rounded-2xl border border-border bg-white p-6 text-center">
			<Heading level={3}>{label}</Heading>

			{description && (
				<Text className="mt-2 text-gray-600">{description}</Text>
			)}

			{actions && (
				<FeatureGrid>
					{actions.map((item, i) => {
						return (
							<Button
								key={`${item?.label}-${i}`}
								variant={item?.variant}
								className={`${actions.length === 1 && "col-span-full"}`}
							>
								{item?.label || "Take Action"}
							</Button>
						);
					})}
				</FeatureGrid>
			)}
		</Section>
	);
};

export default EmptyState;
