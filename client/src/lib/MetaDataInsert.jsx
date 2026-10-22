import { Helmet } from "react-helmet-async";
import { platform } from "./config/index.js";

const MetaDataInsert = ({ title = platform.name }) => {
	let pageTitle =
		title === platform.name
			? `${title} - ${platform.author}`
			: `${title} - ${platform.name}`;

	return (
		<Helmet>
			<title>{pageTitle}</title>
			<meta
				name="description"
				content={`${platform.name} - AI-powered ideation tool for DIY innovators.`}
			/>
			<meta
				name="keywords"
				content="coding, website design, freelancing, software development, ai, llm"
			/>
			<meta property="og:title" content={pageTitle} />
			<meta property="og:description" content="Self made template." />
		</Helmet>
	);
};

export default MetaDataInsert;
