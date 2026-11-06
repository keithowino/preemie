import React from "react";
import { Outlet } from "react-router-dom";

const LabLayout = () => {
	return (
		<div className="min-h-svh bg-sage">
			<Outlet />
		</div>
	);
};

export default LabLayout;
