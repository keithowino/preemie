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
