import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useIdentity } from "../../identity/index.js";

export default function AuthenticatedRoute() {
	const { isAuthenticated, isLoading } = useIdentity();

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
