import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout";
import {
	Explore,
	Footer,
	Header,
	Landing,
	LightBulb,
	WorkSpace,
} from "./lib/index.js";
import { useState } from "react";

const App = () => {
	const [view, setView] = useState("landing");
	const [state, setState] = useState({
		originalObject: "",
		isGenerating: false,
		generatedIdeas: [],
	});
	// const AuthenticatedApp = () => {
	// 	return (
	// 		<Routes>
	// 			<Route path="/" element={<Layout />}>
	// 				<Route index element={<Home />} />
	// 			</Route>
	// 		</Routes>
	// 	);
	// };

	// return (
	// 	<HelmetProvider>
	// 		<Router>
	// 			<AuthenticatedApp />
	// 		</Router>
	// 	</HelmetProvider>
	// );

	return (
		// <Router>
		// 	<Header />
		// 	<Routes>
		// 		<Route path="/" element={<Components.Canvas />} />
		// 	</Routes>
		// </Router>
		<>
			<div className="app min-h-screen flex flex-col bg-linear-to-r from-[#555] to-[#232327c0] animate-pulse selection:bg-purple-500/30 transition-all duration-1000 ease-in-out ">
				<LightBulb />
				<Header setState={setState} setView={setView} />
				<main className="flex-1 pt-24 pb-12 px-6 max-w-7xl mx-auto w-full">
					<Routes>
						<Route
							path="/"
							element={
								view === "landing" && (
									<Landing
										state={state}
										setState={setState}
										setView={setView}
									/>
								)
							}
						/>
						<Route
							path="/explore"
							element={
								view === "explore" && (
									<Explore
										state={state}
										setState={setState}
										setView={setView}
									/>
								)
							}
						/>
						<Route
							path="/work-space"
							element={
								view === "work-space" &&
								state.selectedIdea && (
									<WorkSpace
										state={state}
										setView={setView}
									/>
								)
							}
						/>
					</Routes>
				</main>
				<Footer />
			</div>
		</>
	);
};

export default App;
