import { HomePage, IdeasPage, LibraryPage } from "../pages/index.js";

const workspaceRoutes = [
	{
		path: "/create",
		element: <HomePage />,
	},
	{
		path: "/ideas/:generationId",
		element: <IdeasPage />,
	},
	{
		path: "/library",
		element: <LibraryPage />,
	},
];

export default workspaceRoutes;
