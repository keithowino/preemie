import { useContext } from "react";

import IdentityContext from "./IdentityContext.jsx";

export function useIdentity() {
	const ctx = useContext(IdentityContext);

	if (!ctx) {
		throw new Error("useIdentity must be used within IdentityProvider.");
	}

	return ctx;
}
