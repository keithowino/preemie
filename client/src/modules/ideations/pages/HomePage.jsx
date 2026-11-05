import { useEffect, useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "react-router-dom";

import {
	IdeationConstraintsForm,
	MaterialEditor,
} from "../components/index.js";
import { IDEATION_EXAMPLES } from "../constants/index.js";
import {
	FeatureGrid,
	Heading,
	MetaDataInsert,
	platform,
	Section,
} from "@/lib/index.js";
import { Container } from "@/components/ui/Layouts/container/index.js";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography/Text.jsx";

import { createIdeation } from "../services/index.js";
import { formSchema } from "../validators/ideationFormSchema.js";

const EMPTY_MATERIAL = {
	name: "",
	quantity: "",
	unit: "",
	condition: "",
};

const INITIAL_CONSTRAINTS = {
	goal: "",
	environment: "",
	skillLevel: "",
	notes: "",
};

const INITIAL_VALUES = {
	materials: [{ ...EMPTY_MATERIAL }],
	constraints: { ...INITIAL_CONSTRAINTS },
};

export default function HomePage() {
	const navigate = useNavigate();
	const [selectedExampleId, setSelectedExampleId] = useState(null);

	/**
	 * Only used for the "request failed" banner. Field errors live
	 * inside the form state via TanStack Form; this is for
	 * server/network errors.
	 */
	const [submitError, setSubmitError] = useState(null);

	/**
	 * Flips to true on the first submit attempt. Used to gate the
	 * "Review the highlighted fields" banner so it doesn't show while
	 * the user is still filling out the form for the first time.
	 */
	const [submitAttempted, setSubmitAttempted] = useState(false);

	/**
	 * Anchor we scroll back to when a submit is rejected by validation.
	 */
	const formTopRef = useRef(null);

	const form = useForm({
		defaultValues: INITIAL_VALUES,

		validators: {
			/**
			 * Validate on submit AND on change after the first submit attempt.
			 * That gives "empty form shows errors immediately" semantics
			 * without spamming errors while the user is typing the first time.
			 */
			onSubmit: formSchema,
			onChange: formSchema,
		},

		onSubmit: async ({ value }) => {
			setSubmitError(null);

			const input = {
				materials: value.materials.map((material) => ({
					name: material.name.trim(),
					/**
					 * Coerce only when a value was provided. The API treats
					 * missing quantity as "not specified".
					 */
					...(material.quantity !== ""
						? { quantity: Number(material.quantity) }
						: {}),
					...(material.unit.trim()
						? { unit: material.unit.trim() }
						: {}),
					...(material.condition.trim()
						? { condition: material.condition.trim() }
						: {}),
				})),
				constraints: Object.fromEntries(
					Object.entries(value.constraints).filter(
						([, v]) => typeof v === "string" && v.trim().length > 0,
					),
				),
			};

			try {
				const ideation = await createIdeation(input);

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

				setSubmitError(message);
			}
		},

		listeners: {
			onChange: () => {
				setSubmitError(null);
				setSelectedExampleId(null);
			},
		},
	});

	function applyExample(example) {
		form.reset(
			{
				materials: example.materials.map((material) => ({
					name: material.name ?? "",
					quantity:
						material.quantity === undefined ||
						material.quantity === null
							? ""
							: String(material.quantity),
					unit: material.unit ?? "",
					condition: material.condition ?? "",
				})),
				constraints: {
					...INITIAL_CONSTRAINTS,
					...example.constraints,
				},
			},
			{ keepDefaultValues: true },
		);

		setSelectedExampleId(example.id);
		setSubmitError(null);
	}

	/**
	 * When a submit is attempted and the form is invalid, move the user
	 * back to the top of the form so they can see the inline errors.
	 *
	 * Keyed on `submitAttempted` so it fires exactly once per submit
	 * attempt, not on every re-render caused by typing.
	 */
	useEffect(() => {
		if (!submitAttempted) {
			return;
		}

		const id = window.requestAnimationFrame(() => {
			/**
			 * The form element contains every field with an id equal
			 * to its name. The first one with aria-invalid="true" is
			 * where the user should be looking.
			 */
			const firstInvalid = formTopRef.current?.querySelector(
				'[aria-invalid="true"]',
			);

			if (firstInvalid instanceof HTMLElement) {
				firstInvalid.focus({ preventScroll: false });
				return;
			}

			/**
			 * Fallback: nothing is invalid (stale state), scroll to top.
			 */
			formTopRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		});

		return () => window.cancelAnimationFrame(id);
	}, [submitAttempted]);

	return (
		<>
			<MetaDataInsert title={platform.name} />

			<Container>
				<Section aria-labelledby="examples-heading" className="mt-10">
					<Link
						to="/"
						className="inline-flex font-semibold text-foreground underline underline-offset-4"
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
									className={`rounded-xl border bg-card p-6 text-left text-card-foreground transition ${
										isSelected
											? "border-primary ring-2 ring-primary/20"
											: "border-border hover:border-secondary-foreground/40 hover:shadow-sm"
									}`}
								>
									<span className="flex items-center justify-between gap-3">
										<span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
											{String(index + 1).padStart(2, "0")}
										</span>
										<span
											className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
												isSelected
													? "bg-primary text-primary-foreground"
													: "bg-muted text-muted-foreground"
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
									<span className="mt-2 block text-sm leading-6 text-muted-foreground">
										{example.description}
									</span>
									<span className="mt-4 block text-xs font-medium">
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
					ref={formTopRef}
					noValidate
					onSubmit={(event) => {
						event.preventDefault();
						event.stopPropagation();

						setSubmitAttempted(true);
						form.handleSubmit();
					}}
					className="mt-12 scroll-mt-24 space-y-10"
				>
					<form.Subscribe
						selector={(state) => ({
							isValid: state.isValid,
							fieldErrors: state.fieldMeta,
						})}
					>
						{({ isValid }) => {
							const showValidationSummary =
								submitAttempted && !isValid;

							return showValidationSummary ? (
								<div
									role="alert"
									aria-live="polite"
									className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive"
								>
									Review the highlighted fields before
									continuing.
								</div>
							) : null;
						}}
					</form.Subscribe>

					<MaterialEditor form={form} />

					<div className="border-t border-border" />

					<IdeationConstraintsForm form={form} />

					<div className="border-t border-border pt-6">
						{submitError && (
							<Text
								className="mb-5 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive"
								role="alert"
								aria-live="polite"
							>
								{submitError}
							</Text>
						)}

						<form.Subscribe
							selector={(state) => ({
								isSubmitting: state.isSubmitting,
								isValid: state.isValid,
								canSubmit: state.canSubmit,
							})}
						>
							{({ isSubmitting, canSubmit, isValid }) => (
								<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
									<Text className="max-w-xl">
										{platform.name} will use your materials
										and preferences to explore three
										different approaches to making something
										useful.
									</Text>

									<span
										className="inline-flex"
										title={
											!isSubmitting && !isValid
												? "Please fix the highlighted fields before continuing"
												: isSubmitting
													? "Generating ideas..."
													: undefined
										}
									>
										<Button
											type="submit"
											disabled={
												isSubmitting || !canSubmit
											}
											size="lg"
										>
											{isSubmitting
												? "Generating ideas..."
												: "Generate ideas"}
											{!isSubmitting && (
												<span
													aria-hidden="true"
													className="ml-2"
												>
													→
												</span>
											)}
										</Button>
									</span>
								</div>
							)}
						</form.Subscribe>
					</div>
				</form>
			</Container>
		</>
	);
}
