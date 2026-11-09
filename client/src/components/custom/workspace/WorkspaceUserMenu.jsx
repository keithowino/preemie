import { Link } from "react-router-dom";
import {
	BellIcon,
	ChevronsUpDown,
	CreditCardIcon,
	LogOut,
	Settings,
	ShieldCheck,
	SparklesIcon,
	User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useIdentity } from "@/platform/index.js";
import { useSignOut } from "@/hooks/useSignOut.js";

/**
 * ASSUMPTION: adjust these fields to match what useIdentity() exposes.
 */
function describeUser(user) {
	const name =
		user?.name ||
		[user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
		user?.username ||
		"Your account";
	const email = user?.email ?? "";
	const initials =
		name
			.split(" ")
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0].toUpperCase())
			.join("") || "U";

	return { name, email, initials };
}

export default function WorkspaceUserMenu() {
	const { isMobile } = useSidebar();
	const { user } = useIdentity();
	const signOut = useSignOut();
	const { name, email, initials } = describeUser(user);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<SidebarMenuButton
								size="lg"
								tooltip={name || email}
								className="data-popup-open:bg-sidebar-accent"
							/>
						}
					>
						<Avatar className="size-8">
							<AvatarImage src={user?.avatar?.url} alt={name} />
							<AvatarFallback>{initials}</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{name}</span>
							{email && (
								<span className="truncate text-xs text-muted-foreground">
									{email}
								</span>
							)}
						</div>
						<ChevronsUpDown className="ml-auto size-4" />
					</DropdownMenuTrigger>

					<DropdownMenuContent
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={8}
						className="min-w-56"
					>
						<DropdownMenuGroup>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<Avatar className="size-8">
										<AvatarImage
											src={user?.avatar?.url}
											alt={name}
										/>
										<AvatarFallback>
											{initials}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">
											{name}
										</span>
										<span className="truncate text-xs">
											{email}
										</span>
									</div>
								</div>
							</DropdownMenuLabel>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem disabled>
								<SparklesIcon />
								Upgrade to Pro
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem
								render={<Link to="/account/profile" />}
							>
								<User /> Profile
							</DropdownMenuItem>
							<DropdownMenuItem
								render={<Link to="/account/settings" />}
							>
								<Settings /> Settings
							</DropdownMenuItem>
							<DropdownMenuItem
								render={
									<Link to="/account/settings/security" />
								}
							>
								<ShieldCheck /> Security
							</DropdownMenuItem>
							<DropdownMenuItem disabled>
								<CreditCardIcon />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem disabled>
								<BellIcon />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={signOut}>
								<LogOut /> Sign out
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
