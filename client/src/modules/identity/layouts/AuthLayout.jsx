import { Link, Outlet, useLocation } from "react-router-dom";
import {
	Container,
	Heading,
	Loader,
	MetaDataInsert,
	platform,
	Section,
	Text,
} from "../../../lib/index.js";
import { useIdentity } from "../../../platform/index.js";

const AuthLayout = () => {
	const { isLoading } = useIdentity();

	const location = useLocation();

	const isRegistering = location.pathname === "/register";

	if (isLoading) {
		return (
			<>
				<MetaDataInsert title="Loading session..." />

				<Container>
					<Loader type="page" msg="Checking your session..." />
				</Container>
			</>
		);
	}

	return (
		<>
			<MetaDataInsert
				title={`${isRegistering ? "Create account" : "Log in"}`}
			/>

			<Container>
				<Section className="mx-auto max-w-lg rounded-card border border-border bg-white p-6 sm:p-9">
					<Text className="font-semibold uppercase tracking-[0.14em]">
						{platform.name}
					</Text>
					<Heading level={1}>
						{isRegistering ? "Create your account" : "Welcome back"}
					</Heading>

					<Text className="mt-2">
						{isRegistering
							? "Create an account to generate ideas and access your saved results."
							: "Log in to continue working with your saved ideations."}
					</Text>

					<Outlet />

					<Text className="mt-6">
						{isRegistering
							? "Already have an account? "
							: "Don't have an account yet? "}

						<Link
							to={isRegistering ? "/login" : "/register"}
							state={{ from: location.state?.from }}
							className="font-semibold text-graphite underline underline-offset-4"
						>
							{isRegistering ? "Log in" : "Create one"}
						</Link>
					</Text>
				</Section>
			</Container>
		</>
	);
};

export default AuthLayout;
