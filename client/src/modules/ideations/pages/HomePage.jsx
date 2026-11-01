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
	MetaDataInsert,
	platform,
	Section,
	Text,
	validateIdeationInput,
} from "../../../lib/index.js";
import { Link, useNavigate } from "react-router-dom";
import { createIdeation } from "../services/index.js";

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
	const [isSubmitting, setIsSubmitting] = useState(false);

	const navigate = useNavigate();

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

	async function handleSubmit(event) {
		event.preventDefault();

		if (isSubmitting) {
			return;
		}

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

		/**
		 * Convert UI values into the shape expected by the backend schema.
		 */
		const input = {
			materials: materials.map((material) => ({
				name: material.name.trim(),
				quantity: Number(material.quantity),
				unit: material.unit.trim(),
				condition: material.condition.trim(),
				...(material.specifications?.trim()
					? { specifications: material.specifications.trim() }
					: {}),
			})),

			/**
			 * Empty optional strings should not be sent as values.
			 */
			constraints: Object.fromEntries(
				Object.entries(constraints).filter(
					([, value]) =>
						typeof value === "string" && value.trim().length > 0,
				),
			),
		};

		setIsSubmitting(true);
		setFeedback(null);

		try {
			const ideation = await createIdeation(input);

			// createIdeation validates the response before returning.
			navigate(`/ideas/${encodeURIComponent(ideation.generationId)}`);
		} catch (error) {
			let message =
				"We couldn't generate your ideas. Your entries are still here; please try again.";

			if (error?.code === "REQUEST_TIMEOUT") {
				message =
					"The request timed out. Your entries are still here. Please try again.";
			} else if (error?.code === "NETWORK_ERROR") {
				message =
					"We couldn't connect to the server. Check your connection and try again.";
			} else if (error?.status === 400) {
				message =
					error.message ||
					"Some submitted details were rejected. Review your entries and try again.";
			} else if (error?.status === 429) {
				message =
					error.message ||
					"Too many requests have been made. Please wait a little before trying again.";
			} else if (error?.status >= 500) {
				message =
					"The generation service is temporarily unavailable. Your entries are still here; please try again.";
			} else if (error?.code === "INVALID_RESPONSE") {
				message =
					"The server returned an unexpected response. Please try again.";
			}

			setFeedback({
				type: "error",
				message,
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<>
			<MetaDataInsert title={platform.name} />

			<Container>
				<Section aria-labelledby="examples-heading" className="mt-10">
					<Link
						to="/"
						className="inline-flex font-semibold text-graphite underline underline-offset-4"
					>
						← Back
					</Link>

					<div>
						<Text className="font-semibold uppercase tracking-[0.16em]">
							Need a starting point?
						</Text>

						<Heading level={2} id="examples-heading">
							Try an example
						</Heading>

						<Text className="mt-2">
							Choose a starting point to populate the form. You
							can change any of its details afterward.
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
										{example.materials.length} example
										materials
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
								preferences to explore three different
								approaches to making something useful.
							</Text>

							<Button
								type="submit"
								disabled={isSubmitting}
								className="rounded-control"
								variant="secondary"
							>
								{isSubmitting
									? "Generating ideas..."
									: "Generate ideas"}

								{!isSubmitting && (
									<span aria-hidden="true" className="ml-2">
										→
									</span>
								)}
							</Button>
						</div>
					</div>
				</form>
			</Container>
		</>
	);
}
