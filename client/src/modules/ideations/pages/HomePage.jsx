import { useState } from "react";
import {
	IdeationConstraintsForm,
	MaterialEditor,
} from "../components/index.js";
import { IDEATION_EXAMPLES } from "../constants/index.js";
import {
	Button,
	Container,
	FeatureGrid,
	Heading,
	platform,
	Section,
	Text,
	validateIdeationInput,
} from "../../../lib/index.js";

const INITIAL_MATERIALS = [
	{
		name: "",
		quantity: "",
		unit: "",
		condition: "",
	},
];

const INITIAL_CONSTRAINTS = {
	goal: "",
	environment: "",
	skillLevel: "",
	notes: "",
};

const INITIAL_ERRORS = {
	materials: [],
	constraints: {},
};

export default function HomePage() {
	const [materials, setMaterials] = useState(INITIAL_MATERIALS);
	const [constraints, setConstraints] = useState(INITIAL_CONSTRAINTS);
	const [errors, setErrors] = useState(INITIAL_ERRORS);
	const [selectedExampleId, setSelectedExampleId] = useState(null);
	const [feedback, setFeedback] = useState(null);

	function handleMaterialsChange(nextMaterials) {
		setMaterials(nextMaterials);
		setSelectedExampleId(null);
		setErrors(INITIAL_ERRORS);
		setFeedback(null);
	}

	function handleConstraintsChange(nextConstraints) {
		setConstraints(nextConstraints);
		setSelectedExampleId(null);
		setErrors(INITIAL_ERRORS);
		setFeedback(null);
	}

	function applyExample(example) {
		setMaterials(example.materials.map((material) => ({ ...material })));
		setConstraints({
			...INITIAL_CONSTRAINTS,
			...example.constraints,
		});
		setSelectedExampleId(example.id);
		setErrors(INITIAL_ERRORS);
		setFeedback(null);
	}

	function handleSubmit(event) {
		event.preventDefault();

		const validation = validateIdeationInput({
			materials,
			constraints,
		});

		setErrors(validation.errors);

		if (!validation.isValid) {
			setFeedback({
				type: "error",
				message: "Review the highlighted fields before continuing.",
			});

			return;
		}

		setFeedback({
			type: "success",
			message:
				"Your project details are valid. Idea generation will be connected in the API integration phase.",
		});
	}

	return (
		<Container>
			<Section className="relative overflow-hidden rounded-card border border-border bg-sage p-6 sm:p-10 lg:p-12">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border-[32px] border-white/30 sm:h-72 sm:w-72"
				/>

				<div className="relative max-w-3xl">
					<Text className="font-semibold uppercase tracking-[0.2em]">
						The resourceful design studio
					</Text>

					<Heading level={1} className="max-w-2xl tracking-tight">
						{platform.excerpt}
					</Heading>

					<Text className="mt-5 max-w-2xl text-graphite/80 sm:!text-lg">
						Tell {platform.name} which materials you have available
						and what you want to achieve. Explore practical ideas
						built around reuse, improvement, and invention.
					</Text>

					<a
						href="#project-form"
						className="mt-7 inline-flex items-center justify-center rounded-control bg-graphite px-5 py-3 font-semibold text-white transition hover:bg-graphite/85"
					>
						Start creating
						<span aria-hidden="true" className="ml-2">
							↓
						</span>
					</a>
				</div>
			</Section>

			<Section aria-labelledby="examples-heading" className="mt-10">
				<div>
					<Text className="font-semibold uppercase tracking-[0.16em]">
						Need a starting point?
					</Text>

					<Heading level={2} id="examples-heading">
						Try an example
					</Heading>

					<Text className="mt-2">
						Choose a starting point to populate the form. You can
						change any of its details afterward.
					</Text>
				</div>

				<FeatureGrid>
					{IDEATION_EXAMPLES.map((example, index) => {
						const isSelected = selectedExampleId === example.id;

						return (
							<button
								key={example.id}
								type="button"
								onClick={() => applyExample(example)}
								aria-pressed={isSelected}
								className={`rounded-card border p-5 text-left transition ${
									isSelected
										? "border-signal bg-white ring-2 ring-signal/20"
										: "border-border bg-white hover:border-graphite/40 hover:shadow-sm"
								}`}
							>
								<span className="flex items-center justify-between gap-3">
									<span className="text-sm font-semibold uppercase tracking-wider text-muted">
										{String(index + 1).padStart(2, "0")}
									</span>

									<span
										className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
											isSelected
												? "bg-signal text-white"
												: "bg-canvas text-muted"
										}`}
									>
										{isSelected
											? "Selected"
											: "Use example"}
									</span>
								</span>

								<span className="mt-4 block text-lg font-bold">
									{example.label}
								</span>

								<span className="mt-2 block text-sm leading-6 text-muted">
									{example.description}
								</span>

								<span className="mt-4 block text-xs font-medium text-graphite">
									{example.materials.length} example materials
								</span>
							</button>
						);
					})}
				</FeatureGrid>
			</Section>

			<form
				id="project-form"
				onSubmit={handleSubmit}
				noValidate
				className="mt-12 space-y-10"
			>
				<MaterialEditor
					materials={materials}
					onChange={handleMaterialsChange}
					errors={errors}
				/>

				<div className="border-t border-border" />

				<IdeationConstraintsForm
					constraints={constraints}
					onChange={handleConstraintsChange}
					errors={errors.constraints}
				/>

				<div className="border-t border-border pt-6">
					{feedback && (
						<Text
							className={`mb-5 rounded-control border px-4 py-3 ${
								feedback.type === "error"
									? "border-red-200 bg-red-50 text-red-800"
									: "border-green-200 bg-green-50 text-green-900"
							}`}
							role="status"
							aria-live="polite"
						>
							{feedback.message}
						</Text>
					)}

					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<Text className="max-w-xl">
							{platform.name} will use your materials and
							preferences to explore three different approaches to
							making something useful.
						</Text>

						{/**
						 * The temporary button bellow says “Validate project details” rather than “Generate ideas” because this step does not yet call the API. That avoids implying that ideas have been generated when no request has been sent.
						 */}
						<Button className="rounded-control" variant="secondary">
							Validate project details
							<span aria-hidden="true" className="ml-2">
								→
							</span>
						</Button>
					</div>
				</div>
			</form>
		</Container>
	);
}
