const Navbar = () => {
	return (
		<nav className="hidden md:flex items-center gap-8">
			<a
				href="#"
				className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
			>
				Lab
			</a>
			<a
				href="#"
				className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
			>
				Museum
			</a>
			<a
				href="#"
				className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
			>
				Community
			</a>
		</nav>
	);
};

export default Navbar;
