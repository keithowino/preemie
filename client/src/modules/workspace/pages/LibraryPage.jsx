import { Link } from "react-router-dom";

import { Heading, MetaDataInsert, platform } from "@/lib/index.js";
import { Container } from "@/components/ui/Layouts/container/index.js";
import { Text } from "@/components/ui/typography/Text.jsx";
import { useRecentIdeations } from "@/hooks/useRecentIdeations";

/**
 * #### We should distinguish these two concepts:
 *
 * - Generation: the original output produced by the
 * ideation engine.
 * - Workspace resource: an item the user organizes,
 * saves, archives or otherwise manages.
 *
 * We should not introduce a separate workspace collection
 * prematurely. First, establish what the Library actually
 * needs beyond the existing ideation records.
 *
 * The Library should not simply duplicate the entire
 * Ideation collection.
 */

/**
 * Phase 2: empty state only.
 * Phase 4: fetch GET /ideations with React Query and render the list here.
 */
export default function LibraryPage() {
	const { ideations } = useRecentIdeations(); // Dummy

	return (
		<>
			<MetaDataInsert title={`Library | ${platform.name}`} />

			<Container>
				<Heading level={2}>Library</Heading>

				{ideations.length === 0 && (
					<div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center">
						<Heading level={2} className="text-xl">
							No ideations yet
						</Heading>
						<Text className="mx-auto mt-2 max-w-md text-muted-foreground">
							List the materials you have and what you want to
							make. Your generated ideas are saved here.
						</Text>
						<Link
							to="/create"
							className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						>
							Start an ideation
						</Link>
					</div>
				)}
			</Container>
		</>
	);
}
