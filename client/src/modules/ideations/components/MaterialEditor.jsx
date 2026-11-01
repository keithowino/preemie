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
