import { HomePage, IdeasPage } from "../pages/index.js";

const ideationRoutes = [
	{
		path: "/create",
		element: <HomePage />,
	},
	{
		path: "/ideas/:generationId",
		element: <IdeasPage />,
	},
];

export default ideationRoutes;
