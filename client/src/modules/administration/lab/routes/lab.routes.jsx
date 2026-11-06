import LabLayout from "../layouts/LabLayout.jsx";
import { Test } from "../pages/index.js";

const labRoutes = [
	{
		path: "/lab",
		element: <LabLayout />,
		children: [
			{
				path: "/lab/draft",
				element: <Test />,
			},
		],
	},
];

export default labRoutes;
