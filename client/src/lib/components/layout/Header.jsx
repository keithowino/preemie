import Navbar from "./Navbar.jsx";
import { MdRocket } from "react-icons/md";
// import { Components, data } from "../../../Constants";
import { platform } from "../../config/index.js";
import { useNavigate } from "react-router-dom";

const Header = ({ setState, setView }) => {
	const navigate = useNavigate();

	return (
		<header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5 h-16 flex items-center px-6 justify-between">
			<div
				className="flex items-center gap-2 cursor-pointer group"
				onClick={() => {
					setView("landing");
					setState({
						originalObject: "",
						isGenerating: false,
						generatedIdeas: [],
					});
					navigate("/");
				}}
			>
				<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
					<MdRocket className="w-5 h-5 text-white" />
				</div>
				<span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
					{platform.name}
					<span className="text-purple-500">.</span>
				</span>
			</div>

			<Navbar />

			<button className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all">
				My Workshop
			</button>
		</header>
	);
};

export default Header;
