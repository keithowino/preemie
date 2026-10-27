import { useIdentity } from "../../identity";

export default function useAuthenticatedRoute() {
	const { isAuthenticated, isLoading } = useIdentity();

	return {
		isAuthenticated,
		isLoading,
	};
}
