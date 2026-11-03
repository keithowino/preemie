import { Link } from "react-router-dom";

import {
	Heading,
	MetaDataInsert,
	platform,
	Section,
} from "../../../lib/index.js";
import { Text } from "@/components/ui/typography/Text.jsx";
import { Container } from "@/components/ui/Layouts/container/index.js";
import { useIdentity } from "../../../platform/index.js";

const FEATURES = [
	{
		number: "01",
		title: "Start with what you have",
		description:
			"Describe your available materials, their condition, and any useful specifications.",
	},
	{
		number: "02",
		title: "Explore three approaches",
		description:
			"Compare a repurposing idea, an improvement, and a novel invention.",
	},
	{
		number: "03",
		title: "Build with a plan",
		description:
			"Review materials, tools, ordered steps, scientific principles, and safety considerations.",
	},
];

export default function LandingPage() {
	const { isAuthenticated } = useIdentity();

	return (
		<>
			<MetaDataInsert title={platform.name} />

			<Container>
				{/* Hero */}
				<Section className="relative overflow-hidden rounded-xl border border-border bg-secondary p-6 sm:p-10 lg:p-12">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border-[32px] border-background/70 sm:h-72 sm:w-72"
					/>

					<div className="relative max-w-3xl">
						<Text className="font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
							The resourceful design studio
						</Text>

						<Heading
							level={1}
							className="max-w-2xl tracking-tight text-secondary-foreground"
						>
							{platform.excerpt}
						</Heading>

						<Text className="mt-5 max-w-2xl text-secondary-foreground/80 sm:text-lg!">
							Tell {platform.name} which materials you have
							available and what you want to achieve. Explore
							practical ideas built around reuse, improvement, and
							invention.
						</Text>

						<div className="mt-8 flex flex-wrap gap-3">
							<Link
								to="/register"
								className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							>
								{isAuthenticated
									? "Start creating"
									: "Get started"}
							</Link>

							{!isAuthenticated && (
								<Link
									to="/login"
									className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-background px-5 py-3 font-semibold text-foreground transition hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								>
									Log in
								</Link>
							)}
						</div>

						{!isAuthenticated && (
							<Text className="mt-8 text-secondary-foreground/80">
								Create an account to generate and access your
								saved ideations.
							</Text>
						)}
					</div>
				</Section>

				{/* Feature grid */}
				<Section className="mt-12 sm:mt-16">
					<Heading level={2} className="text-2xl sm:text-3xl">
						From available materials to buildable ideas
					</Heading>

					<Text className="mt-3 max-w-2xl text-muted-foreground">
						Preemie helps you explore possibilities systematically,
						whether you are experimenting at home, learning a new
						skill, or working on a practical project.
					</Text>

					<div className="mt-8 grid gap-5 md:grid-cols-3">
						{FEATURES.map((feature) => (
							<article
								key={feature.number}
								className="rounded-xl border border-border bg-card p-6 text-card-foreground"
							>
								<p className="text-sm font-bold text-muted-foreground">
									{feature.number}
								</p>

								<Heading level={3} className="mt-4 text-xl">
									{feature.title}
								</Heading>

								<Text className="mt-3 leading-7 text-muted-foreground">
									{feature.description}
								</Text>
							</article>
						))}
					</div>
				</Section>

				{/* CTA */}
				<Section className="mt-12 rounded-xl border border-border bg-card p-6 text-card-foreground sm:mt-16 sm:p-10">
					<Heading level={2} className="text-2xl">
						Ready to explore an idea?
					</Heading>

					<Text className="mt-3 text-muted-foreground">
						{isAuthenticated
							? "Describe what you have, explore possible inventions, and turn promising ideas into practical build plans."
							: "Create your account to begin a new ideation and keep your generated results associated with you."}
					</Text>

					<Link
						to="/register"
						className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					>
						{isAuthenticated
							? "Start creating"
							: "Create your account"}
					</Link>
				</Section>
			</Container>
		</>
	);
}
