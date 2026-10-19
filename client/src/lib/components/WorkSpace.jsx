import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaCheckCircle, FaMedkit } from "react-icons/fa";
import { MdHistory } from "react-icons/md";

const WorkSpace = ({ state, setView }) => {
	const navigate = useNavigate();

	return (
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-right-4 duration-700">
			<div className="lg:col-span-8 space-y-12">
				<section className="space-y-6">
					<div className="flex items-center gap-4">
						<button
							onClick={() => {
								setView("/explore");
								navigate("/explore");
							}}
							className="p-2 rounded-full hover:bg-white/5 transition-colors"
						>
							<FaArrowRight className="w-6 h-6 rotate-180" />
						</button>
						<div>
							<h1 className="text-5xl font-bold mb-2">
								{state.selectedIdea.title}
							</h1>
							<p className="text-xl text-zinc-400">
								{state.selectedIdea.fullDescription}
							</p>
						</div>
					</div>

					<div className="rounded-3xl overflow-hidden glass-card aspect-video border-white/5 relative group">
						{!state.conceptImageUrl ? (
							<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-zinc-900/50">
								<div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
								<p className="text-sm font-medium text-purple-400">
									Rendering high-fidelity prototype...
								</p>
							</div>
						) : (
							<img
								src={state.conceptImageUrl}
								alt="Concept Rendering"
								className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
							/>
						)}
						<div className="absolute top-4 left-4 flex gap-2">
							<span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
								AI Concept Visual
							</span>
						</div>
					</div>
				</section>

				<section className="space-y-8">
					<h2 className="text-3xl font-bold">Assembly Roadmap</h2>
					<div className="space-y-4">
						{state.selectedIdea.steps.map((step, idx) => (
							<div key={idx} className="flex gap-6 group">
								<div className="flex flex-col items-center gap-2 pt-1">
									<div className="w-8 h-8 rounded-full border border-purple-500/50 flex items-center justify-center text-sm font-bold text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
										{idx + 1}
									</div>
									{idx !==
										state.selectedIdea.steps.length - 1 && (
										<div className="w-px flex-1 bg-zinc-800" />
									)}
								</div>
								<div className="pb-8 glass-card rounded-2xl p-6 flex-1 hover:border-white/20 transition-all">
									<h4 className="font-bold text-lg mb-2">
										{step.title}
									</h4>
									<p className="text-zinc-400 leading-relaxed text-sm">
										{step.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</section>
			</div>

			<aside className="lg:col-span-4 space-y-8">
				<div className="glass-card rounded-3xl p-8 space-y-6 sticky top-24">
					<div className="space-y-4">
						<h3 className="text-xl font-bold flex items-center gap-2">
							<FaCheckCircle className="w-5 h-5 text-purple-500" />
							Bill of Materials
						</h3>
						<ul className="space-y-3">
							{state.selectedIdea.materials.map((item, i) => (
								<li
									key={i}
									className="flex items-center gap-3 text-sm text-zinc-300"
								>
									<div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
									{item}
								</li>
							))}
						</ul>
					</div>

					<div className="h-px bg-white/5" />

					<div className="space-y-4">
						<h3 className="text-xl font-bold flex items-center gap-2">
							<FaMedkit className="w-5 h-5 text-blue-400" />
							Lab Notes
						</h3>
						<div className="space-y-2">
							{state.selectedIdea.scientificPrinciples.map(
								(principle, i) => (
									<div
										key={i}
										className="p-3 bg-white/5 rounded-xl text-xs font-medium text-zinc-400 italic"
									>
										"Utilizing {principle} to ensure
										structural integrity and efficiency."
									</div>
								),
							)}
						</div>
					</div>

					<div className="pt-4 space-y-3">
						<button className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all shadow-xl shadow-white/5">
							Export PDF Guide
						</button>
						<button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
							Share Invention
						</button>
					</div>

					<div className="flex items-center justify-between text-[10px] text-zinc-600 font-bold uppercase tracking-widest pt-4">
						<div className="flex items-center gap-2">
							<MdHistory className="w-3 h-3" />
							Auto-saved
						</div>
						<span>Lab ID: 772-PR-001</span>
					</div>
				</div>
			</aside>
		</div>
	);
};

export default WorkSpace;
