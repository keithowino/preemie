import { Container } from "@/components/ui/Layouts/container";
import { Heading, MetaDataInsert, Section } from "@/lib";
import { Link } from "react-router-dom";

const AccountSettingsPage = () => {
	return (
		<>
			<MetaDataInsert title="Account Settings" />
			<Container>
				<Section>
					<Heading>AccountSettingsPage</Heading>
					<Link to="/account/settings/security" className="underline">
						Security
					</Link>
				</Section>
			</Container>
		</>
	);
};

export default AccountSettingsPage;
