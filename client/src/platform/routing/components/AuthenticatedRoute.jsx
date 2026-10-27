import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthenticatedRoute } from "../hooks/index.js";

export default function AuthenticatedRoute() {
	const { isAuthenticated, isLoading } = useAuthenticatedRoute();

	const location = useLocation();

	if (isLoading) {
		return null;
	}

	if (!isAuthenticated) {
		return (
			<Navigate
				to="/login"
				replace
				state={{
					from: location,
				}}
			/>
		);
	}

	return <Outlet />;
}
