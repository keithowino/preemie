import { useState } from "react";
import { Link } from "react-router-dom";
import {
	CreditCardIcon,
	MonitorIcon,
	MoonIcon,
	SettingsIcon,
	SunIcon,
	UserIcon,
	UsersIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import StatusDot, { STATUS_OPTIONS } from "./StatusBot.jsx";
import { useTheme } from "@/platform";
import { useIdentity } from "@/platform/index.js";
import { displayName, getInitials, HoldToSignOut } from "../utils/index.js";

/**
 * The signed-in account menu.
 *
 * Responsibilities:
 *   - Present the trigger as a circular avatar with a presence dot.
 *   - Expose status, theme, and navigation into profile/settings/billing.
 *   - Guard sign-out behind a press-and-hold confirmation.
 *
 * The components this renders are the shadcn primitives; the visual
 * conventions (status row, hold-to-sign-out) are ported from the
 * Kokonut UI `ProfileDropdown`, whose morphing trigger did not fit
 * this layout. The interaction contract is Radix's — one menu system
 * manages focus, keyboard, and dismissal. Nothing here re-implements
 * those.
 */
export default function AccountMenu({ onSignOut }) {
	const { user } = useIdentity();
	const { theme, setTheme } = useTheme();

	// -----------------------------------------------------------------------
	// Status
	//
	// TODO: Status is local state for now. When the backend exposes
	// `PATCH /auth/me { status }`, this becomes:
	//
	//   const [status, setStatus] = useState(user.status ?? "online");
	//   const setStatus = useCallback(async (next) => {
	//     const previous = status;
	//     setStatus(next);
	//     try { await identity.updateMe({ status: next }); }
	//     catch { setStatus(previous); notify.error("Couldn't update status."); }
	//   }, [status]);
	//
	// The optimistic-update pattern is the same shape as the sessions page.
	// -----------------------------------------------------------------------
	const [status, setStatus] = useState("online");

	const initials = getInitials(user);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="ghost"
						size="icon"
						className="relative size-10 rounded-full"
						aria-label="Open account menu"
					>
						<Avatar className="size-8">
							{user?.avatar?.url ? (
								<AvatarImage
									src={user.avatar.url}
									alt={displayName(user)}
								/>
							) : null}
							<AvatarFallback className="text-xs">
								{initials}
							</AvatarFallback>
						</Avatar>

						<StatusDot
							status={status}
							className="absolute right-0 bottom-0 size-3"
						/>
					</Button>
				}
			/>

			<DropdownMenuContent align="end" className="w-64">
				{/* Identity header */}
				<div
					role="presentation"
					className="flex items-center gap-3 px-2 py-3"
				>
					<Avatar className="size-10">
						{user?.avatar?.url ? (
							<AvatarImage
								src={user.avatar.url}
								alt={displayName(user)}
							/>
						) : null}
						<AvatarFallback className="text-sm">
							{initials}
						</AvatarFallback>
					</Avatar>

					<div className="min-w-0">
						<p className="truncate text-sm font-medium">
							{displayName(user)}
						</p>
						<p className="truncate text-xs text-muted-foreground">
							{user?.email ?? ""}
						</p>
					</div>
				</div>

				<DropdownMenuSeparator />

				{/* Status */}
				<DropdownMenuRadioGroup
					value={status}
					onValueChange={setStatus}
					disabled
				>
					<DropdownMenuLabel>Status</DropdownMenuLabel>

					{STATUS_OPTIONS.map((option) => (
						<DropdownMenuRadioItem
							key={option.value}
							value={option.value}
						>
							<StatusDot
								status={option.value}
								className="size-2.5 ring-0"
							/>
							{option.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>

				<DropdownMenuSeparator />

				{/* Theme */}
				<DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
					<DropdownMenuLabel>Theme</DropdownMenuLabel>

					<DropdownMenuRadioItem value="light">
						<SunIcon className="size-4 text-muted-foreground" />
						Light
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="dark">
						<MoonIcon className="size-4 text-muted-foreground" />
						Dark
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="system">
						<MonitorIcon className="size-4 text-muted-foreground" />
						System
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>

				<DropdownMenuSeparator />

				{/* Account navigation */}
				<DropdownMenuGroup>
					<DropdownMenuLabel>Account</DropdownMenuLabel>
					<DropdownMenuItem render={<Link to="/account/profile" />}>
						<UserIcon className="size-4 text-muted-foreground" />
						Profile
					</DropdownMenuItem>

					<DropdownMenuItem render={<Link to="/account/settings" />}>
						<SettingsIcon className="size-4 text-muted-foreground" />
						Settings
					</DropdownMenuItem>

					<DropdownMenuItem
						render={<Link to="/account/billing" />}
						disabled
					>
						<CreditCardIcon className="size-4 text-muted-foreground" />
						Billing
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				{/* Placeholder: multi-account switching */}
				<DropdownMenuItem
					render={<Link to="/account/switch" />}
					// A visible "Coming soon" hint so the item is honest about
					// its state. Remove when the page ships.
					title="Account switching is not available yet"
					disabled
				>
					<UsersIcon className="size-4 text-muted-foreground" />
					<span className="flex-1">Switch account</span>
					<span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
						Soon
					</span>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<HoldToSignOut onSignOut={onSignOut} />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
