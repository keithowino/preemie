import { platform } from "../../config/index.js";

const Footer = () => {
	return (
		<footer className="py-8 border-t border-white/5 text-center text-zinc-600 text-sm">
			<p>
				&copy; 2025 {platform.name} Ideation Lab. Powered by{" "}
				{platform.author}.
			</p>
		</footer>
	);
};

export default Footer;
