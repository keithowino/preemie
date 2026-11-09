import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const ACCOUNT = { label: "Account", to: "/account/profile" };

function getCrumbs(pathname) {
	if (pathname === "/create") return [{ label: "New ideation" }];
	if (pathname.startsWith("/ideas/"))
		return [{ label: "Library", to: "/library" }, { label: "Ideation" }];
	if (pathname === "/library") return [{ label: "Library" }];
	if (pathname === "/account/profile") return [ACCOUNT, { label: "Profile" }];
	if (pathname === "/account/settings/security")
		return [ACCOUNT, { label: "Security" }];
	if (pathname.startsWith("/account/settings"))
		return [ACCOUNT, { label: "Settings" }];
	return [{ label: "Workspace" }];
}

export default function WorkspaceTopBar() {
	const { pathname } = useLocation();
	const crumbs = getCrumbs(pathname);

	return (
		<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
			<div className="flex items-center gap-2 px-5">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>

				<Breadcrumb>
					<BreadcrumbList>
						{crumbs.map((crumb, index) => {
							const isLast = index === crumbs.length - 1;
							return (
								<Fragment key={crumb.label}>
									<BreadcrumbItem className="hidden md:block">
										{isLast || !crumb.to ? (
											<BreadcrumbPage>
												{crumb.label}
											</BreadcrumbPage>
										) : (
											<BreadcrumbLink
												render={<Link to={crumb.to} />}
											>
												{crumb.label}
											</BreadcrumbLink>
										)}
									</BreadcrumbItem>
									{!isLast && <BreadcrumbSeparator />}
								</Fragment>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	);
}
