import { FaChevronRight } from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import geminiService from "../geminiService.js";

const Explore = ({ state, setState, setView }) => {
	const navigate = useNavigate();

	const handleSelectIdea = async (idea) => {
		setState((prev) => ({
			...prev,
			selectedIdea: idea,
			conceptImageUrl: undefined,
		}));
		setView("work-space");
		navigate("/work-space");

		// Auto-generate concept image for the workspace
		const imageUrl = await geminiService.generateConceptImage(idea);
		setState((prev) => ({ ...prev, conceptImageUrl: imageUrl }));
	};

	return (
		<div className="space-y-12 animate-in fade-in duration-500">
			<div className="flex flex-col md:flex-row items-end justify-between gap-6">
				<div className="space-y-2">
					<span className="text-purple-400 font-semibold tracking-wider text-xs uppercase">
						Generation Phase
					</span>
					<h2 className="text-4xl font-bold">Innovation Concepts</h2>
					<p className="text-zinc-500">
						Derived from:{" "}
						<span className="text-white">
							"{state.originalObject}"
						</span>
					</p>
				</div>
				{state.isGenerating && (
					<div className="flex items-center gap-3 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400">
						<div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
						<span className="text-sm font-medium">
							Brewing ideas...
						</span>
					</div>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{state.isGenerating
					? [1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-96 glass-card rounded-3xl animate-pulse"
							/>
						))
					: state.generatedIdeas.map((idea, idx) => (
							<div
								key={idx}
								onClick={() => handleSelectIdea(idea)}
								className="group relative flex flex-col h-full glass-card rounded-3xl p-8 hover:bg-white/[0.03] transition-all cursor-pointer border-white/5 hover:border-purple-500/30 overflow-hidden"
							>
								<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
									<MdCreate className="w-8 h-8 text-purple-500" />
								</div>

								<div className="mb-6">
									<span
										className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
											idea.category === "repurpose"
												? "bg-blue-500/10 text-blue-400"
												: idea.category === "improve"
													? "bg-green-500/10 text-green-400"
													: "bg-purple-500/10 text-purple-400"
										}`}
									>
										{idea.category}
									</span>
								</div>

								<h3 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors">
									{idea.title}
								</h3>
								<p className="text-zinc-400 text-sm mb-8 leading-relaxed flex-1">
									{idea.shortDescription}
								</p>

								<div className="space-y-4">
									<div className="flex justify-between text-xs font-medium">
										<span className="text-zinc-500 uppercase">
											Novelty
										</span>
										<span className="text-white">
											{idea.noveltyScore}%
										</span>
									</div>
									<div className="w-full bg-zinc-800 rounded-full h-1">
										<div
											className="bg-purple-500 h-1 rounded-full"
											style={{
												width: `${idea.noveltyScore}%`,
											}}
										/>
									</div>

									<div className="flex justify-between text-xs font-medium pt-2">
										<span className="text-zinc-500 uppercase">
											Feasibility
										</span>
										<span className="text-white">
											{idea.feasibilityScore}%
										</span>
									</div>
									<div className="w-full bg-zinc-800 rounded-full h-1">
										<div
											className="bg-blue-500 h-1 rounded-full"
											style={{
												width: `${idea.feasibilityScore}%`,
											}}
										/>
									</div>
								</div>

								<div className="mt-8 flex items-center gap-2 text-sm font-bold text-white group-hover:gap-4 transition-all">
									Develop Project{" "}
									<FaChevronRight className="w-4 h-4" />
								</div>
							</div>
						))}
			</div>
		</div>
	);
};

export default Explore;
