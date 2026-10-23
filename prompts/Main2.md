## Phase 4 — API integration and generation flow

We may proceed to connect the form to the existing backend.

- Create a centralized HTTP/API client using the configured API base URL.
- Implement the POST /api/v1/ideations request.
- Validate the response shape needed by the frontend.
- Extract generationId from the successful response.
- Navigate to /ideas/:generationId.
- Handle validation errors, rate limits, provider failures, network errors and timeouts.
  Deliverable: A submitted form creates a persisted generation and navigates to its results.

Here are the current state(s) of the following files:

```text
~\client\src\App.jsx
```

```jsx
import { AppProviders, AppRouter } from "./app/index.js";

export default function App() {
	return (
		<AppProviders>
			<AppRouter />
		</AppProviders>
	);
}
```

```text
~\client\src\app\providers\AppProviders.jsx
```

```jsx
/**
 * Later this will possibly compose providers such as:
 * - Authentication
 * - API
 * - Query client
 * - Theme
 * - Notifications
 * - Localization
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

/**
 * Shared server-state configuration.
 *
 * Keep one QueryClient instance for the lifetime of the application.
 *
 * #### The configuration establishes three policies:
 *
 * - Caching: Query data remains fresh for 30 seconds. This reduces
 * unnecessary requests when navigating between screens.
 * - Retries: Transient failures can be retried once, while HTTP client
 * errors such as 400 and 429 are not automatically retried.
 * - Shared cache: All feature components use the same query client.
 */
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 30 * 1000,

			/**
			 * The retry callback accommodates common error shapes, but we
			 * must ensure the future API client exposes the HTTP status
			 * through error.status or error.response.status. Otherwise,
			 * HTTP errors may be treated as transient failures. We will
			 * verify that contract when implementing the shared API client.
			 */
			retry: (failureCount, error) => {
				const status = error?.status ?? error?.response?.status;

				/**
				 * Do not automatically retry client errors, including
				 * validation failures and rate-limit responses.
				 */
				if (status >= 400 && status < 500) {
					return false;
				}

				/**
				 * Allow at most one retry for other failures.
				 */
				return failureCount < 1;
			},
		},
	},
});

export function AppProviders({ children }) {
	return (
		<QueryClientProvider client={queryClient}>
			<HelmetProvider>{children}</HelmetProvider>
		</QueryClientProvider>
	);
}
```

```text
~\client\src\app\router\AppRouter.jsx
```

```jsx
import { BrowserRouter } from "react-router-dom";
import RouterConfiguration from "./RouteConfiguration.jsx";
import { AppShell, ScrollToTop } from "../../lib/index.js";

export function AppRouter() {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<AppShell>
				<RouterConfiguration />
			</AppShell>
		</BrowserRouter>
	);
}
```

```text
~\client\src\app\router\RouteConfiguration.jsx
```

```jsx
import { Navigate, useRoutes } from "react-router-dom";
import { ideationRoutes } from "../../modules/index.js";

/**
 * React Query will manage asynchronous query states,
 * but it does not replace route-level error handling.
 *
 * When we implement the routes, React Router's errorElement
 * or equivalent route error-boundary mechanism can handle
 * unexpected route errors. Expected API failures should remain
 * within the relevant page so that users can retry without
 * losing their context.
 */

function ApplicationRoutes() {
	return useRoutes([
		...ideationRoutes,
		{
			path: "*",
			element: <Navigate to="/" replace />,
		},
	]);
}

export default function RouterConfiguration() {
	return <ApplicationRoutes />;
}
```

```text
~\client\src\modules\ideations\routes\ideation.routes.jsx
```

```jsx
import { HomePage } from "../pages/index.js";

const ideationRoutes = [
	{
		path: "/",
		element: <HomePage />,
	},
];

export default ideationRoutes;
```

```text
~\client\src\modules\ideations\pages\HomePage.jsx
```

```jsx
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
						<p
							className={`mb-5 rounded-control border px-4 py-3 text-sm ${
								feedback.type === "error"
									? "border-red-200 bg-red-50 text-red-800"
									: "border-green-200 bg-green-50 text-green-900"
							}`}
							role="status"
							aria-live="polite"
						>
							{feedback.message}
						</p>
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
```

```text
~\client\src\modules\ideations\components\IdeationConstraintsForm.jsx
```

```jsx
import { FeatureGrid, Section, Text } from "../../../lib/index.js";
import { SKILL_LEVEL_OPTIONS } from "../constants/index.js";
import StepHeader from "./StepHeader.jsx";

const inputClassName =
	"mt-1 w-full rounded-control border border-border bg-white px-3 py-2.5 " +
	"text-graphite placeholder:text-muted/70 focus:border-signal focus:outline-none";

function FieldError({ id, message }) {
	if (!message) return null;

	return (
		<Text id={id} className="mt-1 text-red-700" role="alert">
			{message}
		</Text>
	);
}

export default function IdeationConstraintsForm({
	constraints,
	onChange,
	errors = {},
}) {
	function updateConstraint(field, value) {
		onChange({
			...constraints,
			[field]: value,
		});
	}

	return (
		<Section aria-labelledby="constraints-heading">
			<StepHeader
				load={{
					step: 2,
					hId: "constraints-heading",
					label: "Shape your project",
					desc: "Add context to help Preemie suggest ideas that suit your goals, workspace, and experience.",
				}}
			/>

			<fieldset className="rounded-card border border-border bg-white p-4 shadow-sm sm:p-5">
				<FeatureGrid columns={2}>
					<div className="sm:col-span-2">
						<label
							htmlFor="ideation-goal"
							className="text-sm font-medium"
						>
							What would you like to achieve?
							<span className="ml-1 font-normal text-muted">
								(optional)
							</span>
						</label>

						<input
							id="ideation-goal"
							name="goal"
							type="text"
							maxLength={500}
							value={constraints.goal ?? ""}
							onChange={(event) =>
								updateConstraint("goal", event.target.value)
							}
							placeholder="e.g. Create useful household items"
							className={inputClassName}
							aria-invalid={Boolean(errors.goal)}
							aria-describedby={
								errors.goal ? "ideation-goal-error" : undefined
							}
						/>

						<span className="mt-1 flex items-start justify-between gap-3">
							<FieldError
								id="ideation-goal-error"
								message={errors.goal}
							/>

							{constraints.goal.length >= 1 && (
								<Text
									className="ml-auto shrink-0 text-xs"
									size="text-xs"
								>
									{(constraints.goal ?? "").length} / 500
								</Text>
							)}
						</span>
					</div>

					<div>
						<label
							htmlFor="ideation-environment"
							className="text-sm font-medium"
						>
							Where will you work?
							<span className="ml-1 font-normal text-muted">
								(optional)
							</span>
						</label>

						<input
							id="ideation-environment"
							name="environment"
							type="text"
							maxLength={300}
							value={constraints.environment ?? ""}
							onChange={(event) =>
								updateConstraint(
									"environment",
									event.target.value,
								)
							}
							placeholder="e.g. Small home workshop"
							className={inputClassName}
							aria-invalid={Boolean(errors.environment)}
							aria-describedby={
								errors.environment
									? "ideation-environment-error"
									: undefined
							}
						/>

						<span className="mt-1 flex items-start justify-between gap-3">
							<FieldError
								id="ideation-environment-error"
								message={errors.environment}
							/>

							{constraints.environment.length >= 1 && (
								<Text
									className="ml-auto shrink-0 text-xs"
									size="text-xs"
								>
									{(constraints.environment ?? "").length} /
									300
								</Text>
							)}
						</span>
					</div>

					<div>
						<label
							htmlFor="ideation-skill-level"
							className="text-sm font-medium"
						>
							Your experience
							<span className="ml-1 font-normal text-muted">
								(optional)
							</span>
						</label>

						<select
							id="ideation-skill-level"
							name="skillLevel"
							value={constraints.skillLevel ?? ""}
							onChange={(event) =>
								updateConstraint(
									"skillLevel",
									event.target.value,
								)
							}
							className={inputClassName}
							aria-invalid={Boolean(errors.skillLevel)}
							aria-describedby={
								errors.skillLevel
									? "ideation-skill-level-error"
									: undefined
							}
						>
							<option value="">Choose a skill level</option>

							{SKILL_LEVEL_OPTIONS.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>

						<FieldError
							id="ideation-skill-level-error"
							message={errors.skillLevel}
						/>
					</div>

					<div className="sm:col-span-2">
						<label
							htmlFor="ideation-notes"
							className="text-sm font-medium"
						>
							Additional preferences
							<span className="ml-1 font-normal text-muted">
								(optional)
							</span>
						</label>

						<textarea
							id="ideation-notes"
							name="notes"
							rows={4}
							maxLength={1500}
							value={constraints.notes ?? ""}
							onChange={(event) =>
								updateConstraint("notes", event.target.value)
							}
							placeholder="e.g. Prefer basic hand tools and low-cost additional materials."
							className={`${inputClassName} resize-y`}
							aria-invalid={Boolean(errors.notes)}
							aria-describedby={
								errors.notes
									? "ideation-notes-error"
									: undefined
							}
						/>

						<span className="mt-1 flex items-start justify-between gap-3">
							<FieldError
								id="ideation-notes-error"
								message={errors.notes}
							/>

							{constraints.notes.length >= 1 && (
								<Text
									className="ml-auto shrink-0 text-xs"
									size="text-xs"
								>
									{(constraints.notes ?? "").length} / 1500
								</Text>
							)}
						</span>
					</div>
				</FeatureGrid>
			</fieldset>
		</Section>
	);
}
```

```text
~\client\src\modules\ideations\components\MaterialEditor.jsx
```

```jsx
import { Button, FeatureGrid, Section, Text } from "../../../lib/index.js";
import { MATERIAL_UNIT_SUGGESTIONS } from "../constants/index.js";
import StepHeader from "./StepHeader.jsx";

const MAX_MATERIALS = 30;

const inputClassName =
	"mt-1 w-full rounded-control border border-border bg-white px-3 py-2.5 " +
	"text-graphite placeholder:text-muted/70 focus:border-signal focus:outline-none";

function FieldError({ id, message }) {
	if (!message) return null;

	return (
		<Text id={id} className="mt-1 text-red-700" role="alert">
			{message}
		</Text>
	);
}

export default function MaterialEditor({
	materials,
	onChange,
	errors = { materials: [] },
}) {
	const generalErrors = errors.materials.filter(
		(error) => error.index === null,
	);

	function updateMaterial(index, field, value) {
		const updatedMaterials = materials.map((material, materialIndex) =>
			materialIndex === index
				? { ...material, [field]: value }
				: material,
		);

		onChange(updatedMaterials);
	}

	function addMaterial() {
		if (materials.length >= MAX_MATERIALS) return;

		onChange([
			...materials,
			{
				name: "",
				quantity: "",
				unit: "",
				condition: "",
			},
		]);
	}

	function removeMaterial(indexToRemove) {
		onChange(materials.filter((_, index) => index !== indexToRemove));
	}

	function getFieldError(index, field) {
		return errors.materials.find((error) => error.index === index)
			?.fields?.[field];
	}

	return (
		<Section aria-labelledby="materials-heading">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<StepHeader
					load={{
						step: 1,
						hId: "materials-heading",
						label: "What do you have?",
						desc: "List the materials you can use. Add quantities and conditions when you know them.",
					}}
				/>

				<span className="rounded-full bg-sage px-3 py-1 text-sm font-medium">
					{materials.length} / {MAX_MATERIALS}
				</span>
			</div>

			{generalErrors.map((error, index) => (
				<Text
					key={`${error.fields.general}-${index}`}
					className="rounded-control border border-red-200 bg-red-50 px-3 py-2 text-red-800"
					role="alert"
				>
					{error.fields.general}
				</Text>
			))}

			<datalist id="material-unit-suggestions">
				{MATERIAL_UNIT_SUGGESTIONS.map((unit) => (
					<option key={unit} value={unit} />
				))}
			</datalist>

			<div className="space-y-4">
				{materials.map((material, index) => {
					const nameError = getFieldError(index, "name");
					const quantityError = getFieldError(index, "quantity");
					const unitError = getFieldError(index, "unit");
					const conditionError = getFieldError(index, "condition");

					return (
						<fieldset
							key={index}
							className="rounded-card border border-border bg-white p-4 shadow-sm sm:p-5"
						>
							<div className="mb-4 flex items-center justify-between gap-3">
								<legend className="font-semibold">
									Material {index + 1}
								</legend>

								<button
									type="button"
									onClick={() => removeMaterial(index)}
									disabled={materials.length === 1}
									className="rounded px-2 py-1 text-sm font-medium text-muted hover:bg-canvas hover:text-graphite disabled:cursor-not-allowed disabled:opacity-40"
									aria-label={`Remove material ${index + 1}`}
									title={
										materials.length === 1
											? "At least one material is required"
											: "Remove this material"
									}
								>
									Remove
								</button>
							</div>

							<FeatureGrid columns={2}>
								<div className="sm:col-span-2">
									<label
										htmlFor={`material-name-${index}`}
										className="text-sm font-medium"
									>
										Material name *
									</label>

									<input
										id={`material-name-${index}`}
										name={`materials.${index}.name`}
										type="text"
										required
										maxLength={500}
										value={material.name ?? ""}
										onChange={(event) =>
											updateMaterial(
												index,
												"name",
												event.target.value,
											)
										}
										placeholder="e.g. Plastic bottles"
										className={inputClassName}
										aria-invalid={Boolean(nameError)}
										aria-describedby={
											nameError
												? `material-name-error-${index}`
												: undefined
										}
									/>

									<span className="mt-1 flex items-start justify-between gap-3">
										<FieldError
											id={`material-name-error-${index}`}
											message={nameError}
										/>

										{material.name.length >= 1 && (
											<Text
												className="ml-auto shrink-0 text-xs"
												size="text-xs"
											>
												{(material.name ?? "").length} /
												500
											</Text>
										)}
									</span>
								</div>

								<div>
									<label
										htmlFor={`material-quantity-${index}`}
										className="text-sm font-medium"
									>
										Quantity{" "}
										<span className="text-muted">
											(optional)
										</span>
									</label>

									<input
										id={`material-quantity-${index}`}
										name={`materials.${index}.quantity`}
										type="number"
										min="0"
										step="any"
										value={material.quantity ?? ""}
										onChange={(event) => {
											const value = event.target.value;

											updateMaterial(
												index,
												"quantity",
												value === ""
													? ""
													: Number(value),
											);
										}}
										placeholder="e.g. 5"
										className={inputClassName}
										aria-invalid={Boolean(quantityError)}
										aria-describedby={
											quantityError
												? `material-quantity-error-${index}`
												: undefined
										}
									/>

									<FieldError
										id={`material-quantity-error-${index}`}
										message={quantityError}
									/>
								</div>

								<div>
									<label
										htmlFor={`material-unit-${index}`}
										className="text-sm font-medium"
									>
										Unit{" "}
										<span className="text-muted">
											(optional)
										</span>
									</label>

									<input
										id={`material-unit-${index}`}
										name={`materials.${index}.unit`}
										type="text"
										maxLength={30}
										list="material-unit-suggestions"
										value={material.unit ?? ""}
										onChange={(event) =>
											updateMaterial(
												index,
												"unit",
												event.target.value,
											)
										}
										placeholder="e.g. pieces, meters, liters, pairs"
										className={inputClassName}
										aria-invalid={Boolean(unitError)}
										aria-describedby={
											unitError
												? `material-unit-error-${index}`
												: undefined
										}
									/>

									<span className="mt-1 flex items-start justify-between gap-3">
										<FieldError
											id={`material-unit-error-${index}`}
											message={unitError}
										/>

										{material.unit.length >= 1 && (
											<Text
												className="ml-auto shrink-0 text-xs"
												size="text-xs"
											>
												{(material.unit ?? "").length} /
												30
											</Text>
										)}
									</span>
								</div>

								<div className="sm:col-span-2">
									<label
										htmlFor={`material-condition-${index}`}
										className="text-sm font-medium"
									>
										Condition{" "}
										<span className="text-muted">
											(optional)
										</span>
									</label>

									<input
										id={`material-condition-${index}`}
										name={`materials.${index}.condition`}
										type="text"
										maxLength={200}
										value={material.condition ?? ""}
										onChange={(event) =>
											updateMaterial(
												index,
												"condition",
												event.target.value,
											)
										}
										placeholder="e.g. Clean, dry, slightly worn, operational, partially damaged"
										className={inputClassName}
										aria-invalid={Boolean(conditionError)}
										aria-describedby={
											conditionError
												? `material-condition-error-${index}`
												: undefined
										}
									/>

									<span className="mt-1 flex items-start justify-between gap-3">
										<FieldError
											id={`material-condition-error-${index}`}
											message={conditionError}
										/>

										{material.condition.length >= 1 && (
											<Text
												className="ml-auto shrink-0 text-xs"
												size="text-xs"
											>
												{
													(material.condition ?? "")
														.length
												}{" "}
												/ 200
											</Text>
										)}
									</span>
								</div>
							</FeatureGrid>
						</fieldset>
					);
				})}
			</div>

			<Button
				disabled={materials.length >= MAX_MATERIALS}
				onClick={addMaterial}
				size="sm"
				type="button"
				variant="outline"
				className="rounded-control"
			>
				+ Add another material
			</Button>

			<Text className="text-xs">
				Material name is required. Quantity, unit, and condition are
				optional. You can add up to {MAX_MATERIALS} materials.
			</Text>
		</Section>
	);
}
```
