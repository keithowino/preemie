import { DNA, ThreeCircles } from "react-loader-spinner";
import { Section } from "../section/index.js";
import { cn } from "../../../index.js";

const LoaderChild = ({
	as: Component,
	className,
	loaderClassName,
	loadTypeStyles,
	msg,
	...props
}) => {
	return (
		<div
			className={cn(
				loadTypeStyles,
				"flex items-center",
				msg && "gap-2",
				className,
			)}
		>
			<Component
				visible={true}
				height="80"
				width="80"
				wrapperStyle={{}}
				{...props}
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
const Loader = ({ className, msg = "Loading", type }) => {
	let render;
	let loadTypeStyles;
	let wrapperClass;
	let aria_label;

	switch (type) {
		case "inline":
			render = "inline";
			aria_label = "three-circles-loading";
			break;

		case "page":
			render = "page";
			loadTypeStyles = "min-h-[100svh] justify-center";
			wrapperClass = "dna-wrapper";
			aria_label = "dna-loading";
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
					wrapperClass={wrapperClass}
					ariaLabel={aria_label}
				/>
			)}

			{render === "inline" && (
				<LoaderChild
					as={ThreeCircles}
					// loadTypeStyles={loadTypeStyles}
					msg={msg}
					ariaLabel={aria_label}
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
