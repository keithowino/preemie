import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useIdentity } from "../../identity/index.js";
import { Loader } from "../../../lib/index.js";

export default function AuthenticatedRoute() {
	const { isAuthenticated, isLoading } = useIdentity();

	const location = useLocation();

	if (isLoading) {
		return <Loader type="page" />;
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
