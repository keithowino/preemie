import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getIdeation } from "../services/index.js";
import {
	Container,
	Heading,
	MetaDataInsert,
	Section,
	Text,
	platform,
} from "../../../lib/index.js";

const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function formatLabel(value = "") {
	return value
		.toLowerCase()
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function MaterialsList({ title, materials }) {
	return (
		<div>
			<h4 className="font-semibold">{title}</h4>

			{materials.length === 0 ? (
				<Text className="mt-2 text-sm text-muted">None specified.</Text>
			) : (
				<ul className="mt-2 space-y-2">
					{materials.map((material, index) => (
						<li
							key={`${material.name}-${index}`}
							className="text-sm"
						>
							<span className="font-medium">{material.name}</span>
							{" — "}
							{material.quantity} {material.unit}
							{material.purpose ? ` · ${material.purpose}` : ""}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

function ConceptCard({ concept, index }) {
	const availableMaterials = concept.billOfMaterials.filter(
		(material) => material.source === "AVAILABLE",
	);

	const additionalMaterials = concept.billOfMaterials.filter(
		(material) => material.source === "ADDITIONAL",
	);

	return (
		<article className="rounded-card border border-border bg-white p-5 sm:p-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<Text className="text-sm font-semibold uppercase tracking-wider text-muted">
					Concept {String(index + 1).padStart(2, "0")}
				</Text>

				<span className="rounded-full bg-sage px-3 py-1 text-xs font-semibold">
					{formatLabel(concept.type)}
				</span>
			</div>

			<Heading level={2} className="mt-4 text-xl">
				{concept.title}
			</Heading>

			<Text className="mt-3">{concept.summary}</Text>

			{concept.rationale && (
				<div className="mt-5">
					<h3 className="font-semibold">Why this could work</h3>
					<Text className="mt-1 text-sm">{concept.rationale}</Text>
				</div>
			)}

			<div className="mt-5 grid gap-3 sm:grid-cols-2">
				<div className="rounded-control bg-canvas p-3">
					<Text className="text-xs font-semibold uppercase tracking-wider text-muted">
						Feasibility
					</Text>
					<Text className="mt-1 font-semibold">
						{formatLabel(concept.feasibility.level)}
					</Text>
					<Text className="mt-1 text-sm">
						{concept.feasibility.rationale}
					</Text>
				</div>

				<div className="rounded-control bg-canvas p-3">
					<Text className="text-xs font-semibold uppercase tracking-wider text-muted">
						Complexity
					</Text>
					<Text className="mt-1 font-semibold">
						{formatLabel(concept.complexity)}
					</Text>
				</div>
			</div>

			<div className="mt-6 space-y-5">
				<MaterialsList
					title="Available materials"
					materials={availableMaterials}
				/>

				<MaterialsList
					title="Additional materials needed"
					materials={additionalMaterials}
				/>
			</div>

			<div className="mt-6 border-t border-border pt-5">
				<h3 className="font-semibold">Build plan</h3>

				<Text className="mt-2 text-sm">
					<span className="font-medium">Tools:</span>{" "}
					{concept.buildPlan.tools.join(", ")}
				</Text>

				<ol className="mt-4 list-decimal space-y-3 pl-5">
					{concept.buildPlan.steps
						.slice()
						.sort((a, b) => a.order - b.order)
						.map((step) => (
							<li key={step.order}>
								<p className="font-medium">{step.title}</p>
								<p className="mt-1 text-sm text-muted">
									{step.description}
								</p>
							</li>
						))}
				</ol>
			</div>

			{concept.scientificPrinciples?.length > 0 && (
				<div className="mt-6">
					<h3 className="font-semibold">Scientific principles</h3>
					<ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
						{concept.scientificPrinciples.map((principle) => (
							<li key={principle}>{principle}</li>
						))}
					</ul>
				</div>
			)}

			{concept.limitations?.length > 0 && (
				<div className="mt-6">
					<h3 className="font-semibold">Limitations</h3>
					<ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
						{concept.limitations.map((limitation) => (
							<li key={limitation}>{limitation}</li>
						))}
					</ul>
				</div>
			)}

			{concept.safetyWarnings?.length > 0 && (
				<div className="mt-6 rounded-control border border-amber-200 bg-amber-50 p-4">
					<h3 className="font-semibold">Safety considerations</h3>
					<ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
						{concept.safetyWarnings.map((warning) => (
							<li key={warning}>{warning}</li>
						))}
					</ul>
				</div>
			)}
		</article>
	);
}

export default function IdeasPage() {
	const { generationId } = useParams();

	const [ideation, setIdeation] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [retryCount, setRetryCount] = useState(0);

	useEffect(() => {
		let isCurrentRequest = true;

		async function loadIdeation() {
			setIsLoading(true);
			setError(null);
			setIdeation(null);

			if (!UUID_PATTERN.test(generationId ?? "")) {
				setError({
					type: "invalid",
					message: "This generation link is not valid.",
				});
				setIsLoading(false);
				return;
			}

			try {
				const result = await getIdeation(generationId);

				if (isCurrentRequest) {
					setIdeation(result);
				}
			} catch (requestError) {
				if (!isCurrentRequest) {
					return;
				}

				if (
					requestError?.status === 404 ||
					requestError?.status === 400
				) {
					setError({
						type: "not-found",
						message:
							"We couldn't find a saved ideation for this link.",
					});
				} else {
					setError({
						type: "general",
						message:
							requestError?.message ??
							"We couldn't retrieve these ideas. Please try again.",
					});
				}
			} finally {
				if (isCurrentRequest) {
					setIsLoading(false);
				}
			}
		}

		loadIdeation();

		return () => {
			isCurrentRequest = false;
		};
	}, [generationId, retryCount]);

	return (
		<>
			<MetaDataInsert title={`Your ideas`} />

			<Container>
				<Section className="mt-8">
					<Link
						to="/"
						className="inline-flex font-semibold text-graphite underline underline-offset-4"
					>
						← Back to the idea form
					</Link>

					<Heading level={1} className="mt-6">
						Your ideas
					</Heading>

					<Text className="mt-3 max-w-3xl">
						Compare the three approaches generated from your
						materials and constraints.
					</Text>
				</Section>

				{isLoading && (
					<Section className="mt-8" aria-live="polite">
						<Text>Retrieving your saved ideas...</Text>
					</Section>
				)}

				{!isLoading && error && (
					<Section
						className="mt-8 rounded-card border border-border bg-white p-6"
						aria-live="polite"
					>
						<Heading level={2} className="text-xl">
							{error.type === "invalid"
								? "Invalid generation link"
								: error.type === "not-found"
									? "Ideas not found"
									: "Unable to load your ideas"}
						</Heading>

						<Text className="mt-3">{error.message}</Text>

						{error.type === "general" && (
							<button
								type="button"
								onClick={() =>
									setRetryCount((count) => count + 1)
								}
								className="mt-5 rounded-control bg-graphite px-4 py-2 font-semibold text-white"
							>
								Try again
							</button>
						)}

						<div className="mt-4">
							<Link
								to="/"
								className="font-semibold underline underline-offset-4"
							>
								Return to the idea form
							</Link>
						</div>
					</Section>
				)}

				{!isLoading && ideation && (
					<>
						<Section className="mt-8 rounded-card border border-border bg-white p-5 sm:p-6">
							<Heading level={2} className="text-xl">
								Your starting point
							</Heading>

							<div className="mt-5">
								<h3 className="font-semibold">Materials</h3>
								<ul className="mt-2 space-y-2">
									{ideation.input.materials.map(
										(material, index) => (
											<li
												key={`${material.name}-${index}`}
												className="text-sm"
											>
												<span className="font-medium">
													{material.name}
												</span>
												{" — "}
												{material.quantity}{" "}
												{material.unit}
												{" · "}
												{material.condition}
											</li>
										),
									)}
								</ul>
							</div>

							{Object.keys(ideation.input.constraints ?? {})
								.length > 0 && (
								<div className="mt-6">
									<h3 className="font-semibold">
										Constraints and preferences
									</h3>

									<dl className="mt-2 grid gap-3 sm:grid-cols-2">
										{Object.entries(
											ideation.input.constraints,
										).map(([key, value]) => (
											<div key={key}>
												<dt className="text-sm font-semibold">
													{formatLabel(key)}
												</dt>
												<dd className="text-sm text-muted">
													{formatLabel(String(value))}
												</dd>
											</div>
										))}
									</dl>
								</div>
							)}
						</Section>

						<Section className="mt-10">
							<Heading level={2}>
								Compare your three concepts
							</Heading>

							<Text className="mt-2">
								Each concept takes a different approach. Review
								feasibility, complexity, materials, and safety
								before deciding what to build.
							</Text>

							<div className="mt-6 grid gap-6">
								{ideation.concepts.map((concept, index) => (
									<ConceptCard
										key={concept.id}
										concept={concept}
										index={index}
									/>
								))}
							</div>
						</Section>
					</>
				)}
			</Container>
		</>
	);
}
