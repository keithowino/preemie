import { DNA, ThreeCircles } from "react-loader-spinner";
import { Section } from "../section/index.js";
import { cn } from "../../../utils/index.js";

const LoaderChild = ({
	as: Component,
	className,
	loaderClassName,
	loadTypeStyles,
	msg,
}) => {
	return (
		<div
			className={cn(
				loadTypeStyles,
				"flex items-center justify-center",
				msg && "gap-2",
				className,
			)}
		>
			<Component
				visible={true}
				height="80"
				width="80"
				ariaLabel="dna-loading"
				wrapperStyle={{}}
				wrapperClass="dna-wrapper"
			/>{" "}
			{msg && <span>{msg}</span>}
		</div>
	);
};

/**
 * type can or would be set to either
 * - inline: as inline element loader
 * - component: as component loader
 * - or page: as page loader
 */
const Loader = ({ className, msg, type }) => {
	let render;
	let loadTypeStyles;

	switch (type) {
		case "inline":
			render = "inline";
			break;

		case "page":
			render = "page";
			loadTypeStyles = "min-h-[100svh]";
			break;

		default:
			break;
	}
	return (
		<Section>
			{render === "page" && (
				<LoaderChild
					as={DNA}
					loadTypeStyles={loadTypeStyles}
					msg={msg}
				/>
			)}

			{/* <ThreeCircles
				visible={true}
				height="100"
				width="100"
				color="#4fa94d"
				ariaLabel="three-circles-loading"
				wrapperStyle={{}}
				wrapperClass=""
			/> */}
		</Section>
	);
};

export default Loader;
