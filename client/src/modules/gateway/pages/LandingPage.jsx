import { Link } from "react-router-dom";

import {
	Container,
	Heading,
	MetaDataInsert,
	platform,
	Section,
	Text,
} from "../../../lib/index.js";
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
							Tell {platform.name} which materials you have
							available and what you want to achieve. Explore
							practical ideas built around reuse, improvement, and
							invention.
						</Text>

						<div className="mt-8 flex flex-wrap gap-3">
							<Link
								to="/register"
								className="inline-flex min-h-11 items-center justify-center rounded-control bg-graphite px-5 py-3 font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-graphite focus:ring-offset-2"
							>
								{isAuthenticated
									? "Start creating"
									: "Get started"}
							</Link>

							{!isAuthenticated && (
								<Link
									to="/login"
									className="inline-flex min-h-11 items-center justify-center rounded-control border border-border bg-white px-5 py-3 font-semibold text-graphite transition hover:bg-canvas focus:outline-none focus:ring-2 focus:ring-graphite focus:ring-offset-2"
								>
									Log in
								</Link>
							)}
						</div>

						{!isAuthenticated && (
							<Text className="mt-8">
								Create an account to generate and access your
								saved ideations.
							</Text>
						)}
					</div>
				</Section>

				<Section className="mt-12 sm:mt-16">
					<Heading level={2} className="text-2xl sm:text-3xl">
						From available materials to buildable ideas
					</Heading>

					<Text className="mt-3 max-w-2xl">
						Preemie helps you explore possibilities systematically,
						whether you are experimenting at home, learning a new
						skill, or working on a practical project.
					</Text>

					<div className="mt-8 grid gap-5 md:grid-cols-3">
						{FEATURES.map((feature) => (
							<article
								key={feature.number}
								className="rounded-card border border-border bg-white p-6"
							>
								<p className="text-sm font-bold text-muted">
									{feature.number}
								</p>

								<Heading level={3} className="mt-4 text-xl">
									{feature.title}
								</Heading>

								<Text className="mt-3 leading-7">
									{feature.description}
								</Text>
							</article>
						))}
					</div>
				</Section>

				<Section className="mt-12 rounded-card border border-border bg-white p-6 sm:mt-16 sm:p-10">
					<Heading level={2} className="text-2xl">
						Ready to explore an idea?
					</Heading>

					<Text className="mt-3">
						{isAuthenticated
							? "Describe what you have, explore possible inventions, and turn promising ideas into practical build plans."
							: "Create your account to begin a new ideation and keep your generated results associated with you."}
					</Text>

					<Link
						to="/register"
						className="mt-6 inline-flex min-h-11 items-center justify-center rounded-control bg-graphite px-5 py-3 font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-graphite focus:ring-offset-2"
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
