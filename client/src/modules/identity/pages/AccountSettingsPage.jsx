import { Heading, MetaDataInsert, Section } from "@/lib/index.js";
import { Text } from "@/components/ui/typography/Text.jsx";

export default function AccountSettingsPage() {
	return (
		<>
			<MetaDataInsert title="Account Settings" />
			<Section>
				<Heading level={3}>Settings</Heading>
				<Text className="mt-2">
					Preferences such as theme and notifications will live here.
				</Text>
			</Section>
		</>
	);
}
