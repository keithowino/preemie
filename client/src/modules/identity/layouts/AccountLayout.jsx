import { NavLink, Outlet } from "react-router-dom";
import { Settings, ShieldCheck, User } from "lucide-react";

import { cn } from "@/lib/utils.js";
import { Heading } from "@/lib/index.js";
import { Container } from "@/components/ui/Layouts/container/index.js";
import { Text } from "@/components/ui/typography/Text.jsx";

/**
 * `end` stops "/account/settings" from also lighting up
 * when the user is on "/account/settings/security".
 */
const ACCOUNT_NAV = [
	{ to: "/account/profile", label: "Profile", icon: User },
	{ to: "/account/settings", label: "Settings", icon: Settings },
	{ to: "/account/settings/security", label: "Security", icon: ShieldCheck },
];

/**
 * Local sub-navigation for /account/*.
 * The global sidebar stays; this adds a secondary nav inside the
 * content area: a vertical list on desktop, scrollable pills on mobile.
 * Child pages render only their own content (no Container, no h1).
 */
export default function AccountLayout() {
	return (
		<Container className="py-6 sm:py-8">
			<div>
				<Heading level={2}>Account</Heading>
				<Text className="mt-1">
					Manage your profile, preferences and security.
				</Text>
			</div>

			<div className="mt-6 flex flex-col gap-6 md:flex-row md:gap-10">
				<nav
					aria-label="Account sections"
					className="flex gap-1 overflow-x-auto border-b border-border pb-2 md:w-56 md:shrink-0 md:flex-col md:overflow-visible md:border-b-0 md:pb-0"
				>
					{ACCOUNT_NAV.map(({ to, label, icon: Icon }) => (
						<NavLink
							key={to}
							to={to}
							end
							className={({ isActive }) =>
								cn(
									"inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
									isActive
										? "bg-secondary text-secondary-foreground"
										: "text-muted-foreground hover:bg-muted hover:text-foreground",
								)
							}
						>
							<Icon className="size-4" aria-hidden="true" />
							{label}
						</NavLink>
					))}
				</nav>

				<div className="min-w-0 flex-1">
					<Outlet />
				</div>
			</div>
		</Container>
	);
}
