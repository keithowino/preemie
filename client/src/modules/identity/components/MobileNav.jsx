import { useState } from "react";
import { Link } from "react-router-dom";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useIdentity } from "@/platform/index.js";
import { HoldToSignOut } from "../utils/index.js";

export default function MobileNav({ onSignOut }) {
	const { isAuthenticated } = useIdentity();
	const [open, setOpen] = useState(false);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger
				render={
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full"
						aria-label="Open navigation"
					>
						<MenuIcon className="size-5" />
					</Button>
				}
			/>

			<DropdownMenuContent align="end" className="w-52">
				<DropdownMenuItem render={<Link to="/community" />}>
					Community
				</DropdownMenuItem>

				<DropdownMenuItem render={<Link to="/museum" />}>
					Museum
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				{isAuthenticated ? (
					<>
						<DropdownMenuItem
							render={<Link to="/account/profile" />}
						>
							Profile
						</DropdownMenuItem>
						<DropdownMenuItem
							render={<Link to="/account/settings" />}
						>
							Settings
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<HoldToSignOut onSignOut={onSignOut} />
					</>
				) : (
					<>
						<DropdownMenuItem render={<Link to="/login" />}>
							Sign in
						</DropdownMenuItem>
						<DropdownMenuItem render={<Link to="/register" />}>
							Create account
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
