import { FeatureGrid, Section } from "@/lib/index.js";
import { SKILL_LEVEL_OPTIONS } from "../constants/index.js";
import StepHeader from "./StepHeader.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import {
	Field,
	FieldError,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea.jsx";

export default function IdeationConstraintsForm({ form }) {
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

			<Card className="rounded-xl shadow-sm">
				<CardContent>
					<FieldSet>
						<FeatureGrid columns={2}>
							<form.Field
								name="constraints.goal"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid;
									return (
										<Field
											data-invalid={isInvalid}
											className="sm:col-span-2"
										>
											<FieldLabel htmlFor={field.name}>
												What would you like to achieve?{" "}
												<span className="ml-1 font-normal text-muted-foreground">
													(optional)
												</span>
											</FieldLabel>

											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(event) =>
													field.handleChange(
														event.target.value,
													)
												}
												aria-invalid={isInvalid}
												placeholder="e.g. Create useful household items"
												autoComplete="off"
											/>

											{isInvalid && (
												<FieldError
													errors={
														field.state.meta.errors
													}
												/>
											)}
										</Field>
									);
								}}
							/>

							<form.Field
								name="constraints.environment"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>
												Where will you work?{" "}
												<span className="ml-1 font-normal text-muted-foreground">
													(optional)
												</span>
											</FieldLabel>

											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(event) =>
													field.handleChange(
														event.target.value,
													)
												}
												aria-invalid={isInvalid}
												placeholder="e.g. Small home workshop"
												autoComplete="off"
											/>

											{isInvalid && (
												<FieldError
													errors={
														field.state.meta.errors
													}
												/>
											)}
										</Field>
									);
								}}
							/>

							<form.Field
								name="constraints.skillLevel"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>
												Your experience{" "}
												<span className="ml-1 font-normal text-muted-foreground">
													(optional)
												</span>
											</FieldLabel>

											<Select
												value={field.state.value}
												onValueChange={(value) =>
													field.handleChange(value)
												}
											>
												<SelectTrigger
													id={field.name}
													aria-invalid={isInvalid}
													className="w-full"
												>
													<SelectValue placeholder="Choose a skill level" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														{SKILL_LEVEL_OPTIONS.map(
															(level) => (
																<SelectItem
																	key={
																		level.value
																	}
																	value={
																		level.value
																	}
																>
																	{
																		level.label
																	}
																</SelectItem>
															),
														)}
													</SelectGroup>
												</SelectContent>
											</Select>

											{isInvalid && (
												<FieldError
													errors={
														field.state.meta.errors
													}
												/>
											)}
										</Field>
									);
								}}
							/>

							<form.Field
								name="constraints.notes"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid;
									return (
										<Field
											data-invalid={isInvalid}
											className="sm:col-span-2"
										>
											<FieldLabel htmlFor={field.name}>
												Additional preferences{" "}
												<span className="ml-1 font-normal text-muted-foreground">
													(optional)
												</span>
											</FieldLabel>

											<Textarea
												id={field.name}
												name={field.name}
												rows={4}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(event) =>
													field.handleChange(
														event.target.value,
													)
												}
												aria-invalid={isInvalid}
												placeholder="e.g. Prefer basic hand tools and low-cost additional materials."
											/>

											{isInvalid && (
												<FieldError
													errors={
														field.state.meta.errors
													}
												/>
											)}
										</Field>
									);
								}}
							/>
						</FeatureGrid>
					</FieldSet>
				</CardContent>
			</Card>
		</Section>
	);
}
