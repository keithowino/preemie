import { FeatureGrid, Section } from "@/lib/index.js";
import { Text } from "@/components/ui/typography/Text.jsx";
import { MATERIAL_UNIT_SUGGESTIONS } from "../constants/index.js";
import StepHeader from "./StepHeader.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import {
	Field,
	FieldError,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field.jsx";

const MAX_MATERIALS = 30;

const EMPTY_MATERIAL = {
	name: "",
	quantity: "",
	unit: "",
	condition: "",
};

export default function MaterialEditor({ form }) {
	return (
		<Section aria-labelledby="materials-heading">
			<form.Subscribe
				selector={(state) => ({
					count: state.values.materials.length,
				})}
			>
				{({ count }) => (
					<div className="flex flex-wrap items-start justify-between gap-3">
						<StepHeader
							load={{
								step: 1,
								hId: "materials-heading",
								label: "What do you have?",
								desc: "List the materials you can use. Add quantities and conditions when you know them.",
							}}
						/>

						<span className="rounded-full bg-sage px-3 py-1 text-sm font-medium text-secondary-foreground">
							{count} / {MAX_MATERIALS}
						</span>
					</div>
				)}
			</form.Subscribe>

			<datalist id="material-unit-suggestions">
				{MATERIAL_UNIT_SUGGESTIONS.map((unit) => (
					<option key={unit} value={unit} />
				))}
			</datalist>

			<form.Field name="materials" mode="array">
				{(materialsField) => (
					<div className="space-y-4">
						{materialsField.state.value.map((_, index) => (
							<Card key={index} className="rounded-xl shadow-sm">
								<CardContent>
									<FieldSet>
										<div className="mb-4 flex items-center justify-between gap-3">
											<FieldLegend className="font-semibold">
												Material {index + 1}
											</FieldLegend>

											<Button
												type="button"
												variant="primary"
												size="sm"
												onClick={() =>
													materialsField.removeValue(
														index,
													)
												}
												disabled={
													materialsField.state.value
														.length === 1
												}
												title={
													materialsField.state.value
														.length === 1
														? "At least one material is required"
														: "Remove this material"
												}
											>
												Remove
											</Button>
										</div>

										<FeatureGrid columns={2}>
											<MaterialTextField
												form={form}
												index={index}
												fieldName="name"
												label="Material name *"
												placeholder="e.g. Plastic bottles"
												maxLength={500}
												className="sm:col-span-2"
											/>

											<MaterialTextField
												form={form}
												index={index}
												fieldName="quantity"
												label={
													<>
														Quantity{" "}
														<span className="text-muted-foreground">
															(optional)
														</span>
													</>
												}
												placeholder="e.g. 5"
												type="number"
												min="0"
												step="any"
											/>

											<MaterialTextField
												form={form}
												index={index}
												fieldName="unit"
												label={
													<>
														Unit{" "}
														<span className="text-muted-foreground">
															(optional)
														</span>
													</>
												}
												placeholder="e.g. pieces, meters, liters, pairs"
												maxLength={30}
												list="material-unit-suggestions"
											/>

											<MaterialTextField
												form={form}
												index={index}
												fieldName="condition"
												label={
													<>
														Condition{" "}
														<span className="text-muted-foreground">
															(optional)
														</span>
													</>
												}
												placeholder="e.g. Clean, dry, slightly worn, operational, partially damaged"
												maxLength={200}
												className="sm:col-span-2"
											/>
										</FeatureGrid>
									</FieldSet>
								</CardContent>
							</Card>
						))}

						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() =>
								materialsField.pushValue({ ...EMPTY_MATERIAL })
							}
							disabled={
								materialsField.state.value.length >=
								MAX_MATERIALS
							}
						>
							+ Add another material
						</Button>
					</div>
				)}
			</form.Field>

			<Text className="text-xs text-muted-foreground">
				Material name is required. Quantity, unit, and condition are
				optional. You can add up to {MAX_MATERIALS} materials.
			</Text>
		</Section>
	);
}

/**
 * A field wrapper that removes the repetition across the inputs
 */
function MaterialTextField({
	form,
	index,
	fieldName,
	label,
	className,
	...inputProps
}) {
	return (
		<form.Field
			name={`materials[${index}].${fieldName}`}
			children={(field) => {
				const isInvalid =
					field.state.meta.isTouched && !field.state.meta.isValid;

				return (
					<Field data-invalid={isInvalid} className={className}>
						<FieldLabel htmlFor={field.name}>{label}</FieldLabel>

						<Input
							id={field.name}
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(event) =>
								field.handleChange(event.target.value)
							}
							aria-invalid={isInvalid}
							autoComplete="off"
							{...inputProps}
						/>

						{isInvalid && (
							<FieldError
								id={`${field.name}-error`}
								errors={field.state.meta.errors}
							/>
						)}
					</Field>
				);
			}}
		/>
	);
}
