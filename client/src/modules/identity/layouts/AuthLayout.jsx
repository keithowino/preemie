import { Link, Outlet, useLocation } from "react-router-dom";
import {
	Heading,
	Loader,
	MetaDataInsert,
	platform,
	Section,
} from "../../../lib/index.js";
import { Text } from "@/components/ui/typography/Text.jsx";
import { Container } from "@/components/ui/Layouts/container/index.js";
import { useIdentity } from "../../../platform/index.js";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card.jsx";
import { FieldDescription } from "@/components/ui/field.jsx";

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

			<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
				<Section className="flex w-full max-w-sm flex-col gap-6">
					<a
						href="/"
						className="flex items-center gap-2 self-center font-medium"
					>
						<div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="h-6 w-6"
							>
								<path d="M12 20v-8" />
								<path d="M12 13C5 13 4 7 4 4c6 0 10 3 8 9Z" />
								<path d="M12 16c0-5 3-8 8-8 0 4-2 8-8 8Z" />
							</svg>
						</div>
						{platform.name}.
					</a>

					<Card className="rounded-md">
						<CardHeader className="text-center">
							<CardTitle className="text-xl">
								{isRegistering
									? "Create your account"
									: "Welcome back"}
							</CardTitle>
							<CardDescription>
								{isRegistering
									? "Create an account to generate ideas and access your saved results."
									: "Log in to continue working with your saved ideations."}
							</CardDescription>
						</CardHeader>

						<CardContent>
							<Outlet />
						</CardContent>
					</Card>
					
					<FieldDescription className="px-6 text-center">
						By clicking continue, you agree to our{" "}
						<a href="#">Terms of Service</a> and{" "}
						<a href="#">Privacy Policy</a>.
					</FieldDescription>

					{/* <Text className="mt-6">
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
					</Text> */}
				</Section>
			</div>
		</>
	);
};

export default AuthLayout;
