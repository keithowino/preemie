import { Heading, MetaDataInsert, Section } from "@/lib/index.js";
import { Text } from "@/components/ui/typography/Text.jsx";

export default function ProfilePage() {
	return (
		<>
			<MetaDataInsert title="My Profile" />
			<Section>
				<Heading level={3}>Profile</Heading>
				<Text className="mt-2">
					Your name, avatar and contact details will be editable here.
				</Text>
			</Section>
		</>
	);
}
