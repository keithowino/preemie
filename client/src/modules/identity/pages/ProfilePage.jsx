import { Container } from "@/components/ui/Layouts/container";
import { Heading, MetaDataInsert, Section } from "@/lib";

const ProfilePage = () => {
	return (
		<>
			<MetaDataInsert title="My Profile" />
			<Container>
				<Section>
					<Heading>ProfilePage</Heading>
				</Section>
			</Container>
		</>
	);
};

export default ProfilePage;
