export function getErrorMessage(error, mode) {
	if (error?.status === 400) {
		return (
			error.message || "Check the information you entered and try again."
		);
	}

	if (error?.status === 401) {
		return mode === "login"
			? "The email or password is incorrect."
			: "We couldn't complete registration with those details.";
	}

	if (error?.status === 409) {
		return "An account with those details may already exist.";
	}

	if (error?.code === "NETWORK_ERROR") {
		return "We couldn't connect to the server. Check your connection and try again.";
	}

	if (error?.status >= 500) {
		return "The service is temporarily unavailable. Please try again.";
	}

	return error?.message || "Something went wrong. Please try again.";
}

export function getDestination(location) {
	const from = location.state?.from;

	if (
		!from?.pathname ||
		from.pathname === "/login" ||
		from.pathname === "/register"
	) {
		return "/create";
	}

	return `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`;
}
