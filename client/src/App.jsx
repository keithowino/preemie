import { AppProviders, AppRouter } from "./app/index.js";

export default function App() {
	return (
		<AppProviders>
			<AppRouter />
		</AppProviders>
	);
}
