import { Heading, Text } from "../../../lib/index.js";

const StepHeader = ({ load }) => {
	return (
		<div>
			<Text className="font-semibold uppercase tracking-[0.16em]">
				Step {load.step}
			</Text>

			<Heading id={load.hId} level={2}>
				{load.label}
			</Heading>

			<Text className="mt-2 max-w-2xl">{load.desc}</Text>
		</div>
	);
};

export default StepHeader;
