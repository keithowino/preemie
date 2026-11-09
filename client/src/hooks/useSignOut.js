import { useNavigate } from "react-router-dom";
import { useIdentity } from "@/platform/index.js";

/**
 * Shared sign-out handler. IdentityProvider clears the local session
 * even when the server-side logout request fails, so we always
 * navigate home afterwards.
 */
export function useSignOut() {
	const { logout } = useIdentity();
	const navigate = useNavigate();

	return async function signOut() {
		try {
			await logout();
		} catch {
			/* local session is already cleared by IdentityProvider */
		} finally {
			navigate("/", { replace: true });
		}
	};
}
