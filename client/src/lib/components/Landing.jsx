import { FaArrowRight, FaLightbulb, FaUpload } from "react-icons/fa";
import { MdBuild, MdCamera, MdRecycling } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import geminiService from "../geminiService.js";

const Landing = ({ setView, setState, state }) => {
	const navigate = useNavigate();

	const handleStartInvention = async () => {
		if (!state.originalObject.trim()) return;

		setState((prev) => ({ ...prev, isGenerating: true }));
		setView("explore");
		navigate("/explore");

		try {
			const ideas = await geminiService.generateInventionIdeas(
				state.originalObject,
				state.imagePreview?.split(",")[1],
			);
			setState((prev) => ({
				...prev,
				generatedIdeas: ideas,
				isGenerating: false,
			}));
		} catch (error) {
			console.error(error);
			setState((prev) => ({ ...prev, isGenerating: false }));
		}
	};

	const handleImageUpload = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setState((prev) => ({ ...prev, imagePreview: reader.result }));
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		// The animate-in fade-in slide-in-from-bottom-4 classes are not active
		<div className="flex flex-col items-center justify-center text-center space-y-12 py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 ">
			<div className="space-y-4 max-w-2xl">
				<h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight">
					Turn your <span className="gradient-text">everyday</span>{" "}
					into <span className="gradient-text">extraordinary</span>
				</h1>
				<p className="text-xl text-zinc-400">
					The AI-powered lab for tinkerers, dreamers, and inventors.
					<br /> Bring an object, we'll bring the vision.
				</p>
			</div>

			<div className="w-full max-w-xl glass-card rounded-3xl p-6 shadow-2xl shadow-purple-500/10 border-white/10 animate-pulse">
				<div className="flex flex-col gap-4">
					<div className="relative">
						<input
							type="text"
							value={state.originalObject}
							// It was onChange={(e) => setState(prev => ({ ...prev, originalObject: e.target.value }))}
							onChange={(e) => {
								setState((prev) => ({
									...prev,
									originalObject: e.target.value,
								}));
								e.target.parentElement.parentElement.parentElement.classList.remove(
									"animate-pulse",
								);
							}}
							placeholder="I have an old toy propeller..."
							className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all pr-32"
						/>
						<button
							onClick={handleStartInvention}
							disabled={!state.originalObject.trim()}
							className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all flex items-center gap-2"
						>
							Ideate <FaArrowRight className="w-4 h-4" />
						</button>
					</div>

					<div className="flex items-center gap-4 justify-center">
						<label className="flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-white transition-colors">
							<MdCamera className="w-4 h-4" />
							<span className="text-sm">Snap photo</span>
							<input
								type="file"
								accept="image/*"
								capture="environment"
								className="hidden"
								onChange={handleImageUpload}
							/>
						</label>
						<div className="w-1 h-1 rounded-full bg-zinc-800" />
						<label className="flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-white transition-colors">
							<FaUpload className="w-4 h-4" />
							<span className="text-sm">Upload ref</span>
							<input
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleImageUpload}
							/>
						</label>
					</div>

					{state.imagePreview && (
						<div className="mt-4 relative group rounded-xl overflow-hidden aspect-video">
							<img
								src={state.imagePreview}
								alt="Preview"
								className="w-full h-full object-cover"
							/>
							<button
								onClick={() =>
									setState((prev) => ({
										...prev,
										imagePreview: undefined,
									}))
								}
								className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
							>
								×
							</button>
						</div>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl text-left">
				{[
					{
						icon: MdRecycling,
						title: "Repurpose",
						desc: "Turn junk into high-value functional gadgets.",
					},
					{
						icon: MdBuild,
						title: "Optimize",
						desc: "Apply scientific principles to boost efficiency.",
					},
					{
						icon: FaLightbulb,
						title: "Invent",
						desc: "Discover patent-worthy novel configurations.",
					},
				].map((feature, i) => (
					<div
						key={i}
						className="space-y-3 p-6 glass-card rounded-2xl hover:border-white/20 transition-colors"
					>
						<div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-purple-400">
							<feature.icon className="w-6 h-6" />
						</div>
						<h3 className="font-bold text-lg">{feature.title}</h3>
						<p className="text-sm text-zinc-500 leading-relaxed">
							{feature.desc}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default Landing;
