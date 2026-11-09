import { Link, useLocation } from "react-router-dom";
import {
	ArrowRightIcon,
	ChevronRightIcon,
	FolderIcon,
	GalleryHorizontal,
	Library,
	MoreHorizontalIcon,
	PlantPot,
	Plus,
	RobotArmIcon,
	TerminalSquareIcon,
	Trash2Icon,
} from "lucide-react";

import { platform } from "@/lib/index.js";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
	useSidebar,
} from "@/components/ui/sidebar";
import WorkspaceUserMenu from "./WorkspaceUserMenu.jsx";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible.jsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";

/**
 * Once i am confident with this component remove
 * - ~\src\components\app-sidebar.jsx
 * - ~\src\components\nav-main.jsx
 * - ~\src\components\nav-projects.jsx
 * - ~\src\components\nav-user.jsx
 */

const data = {
	navMain: [
		{
			title: "Playground",
			url: "#",
			icon: <TerminalSquareIcon />,
			isActive: true,
			items: [
				/**
				 * Add Community / Museum here once their routes exist.
				 * (Right now they fall through to the catch-all redirect.)
				 */
				{
					title: "New ideation",
					url: "/create",
					icon: <Plus />,
				},
				{
					title: "Library",
					url: "/library",
					icon: <Library />,
				},
			],
		},
	],
	// Sample data
	ideations: [
		{
			name: "Vertical Bottle Garden Planter",
			icon: <PlantPot />,
			generationId: "34877372-2406-40a5-a51b-728bb4fcf35e",
		},
		{
			name: "Bottle-Wood Desk Organizer",
			icon: <GalleryHorizontal />,
			generationId: "edc2474c-6e04-4296-89d0-8a2c636cb62a",
		},
		{
			name: "Alphie Solar Garden Beacon",
			icon: <RobotArmIcon />,
			generationId: "d7b4ef98-30bb-4d06-91d4-6e3f13137d69",
		},
	],
};

function BrandMark() {
	return (
		<span
			aria-hidden="true"
			className="flex aspect-square size-8 items-center justify-center rounded-lg bg-secondary text-foreground"
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="size-5"
			>
				<path d="M12 20v-8" />
				<path d="M12 13C5 13 4 7 4 4c6 0 10 3 8 9Z" />
				<path d="M12 16c0-5 3-8 8-8 0 4-2 8-8 8Z" />
			</svg>
		</span>
	);
}

export default function WorkspaceSidebar(props) {
	const { pathname } = useLocation();
	const { isMobile } = useSidebar();

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							tooltip={platform.name}
							render={
								<Link
									to="/"
									aria-label={`${platform.name} home`}
								/>
							}
						>
							<BrandMark />
							<span className="font-heading text-lg font-extrabold tracking-tight">
								{platform.name}
							</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Platform</SidebarGroupLabel>
					<SidebarMenu>
						{data.navMain.map((item) => (
							<Collapsible
								key={item.title}
								defaultOpen={item.isActive}
								className="group/collapsible"
								render={<SidebarMenuItem />}
							>
								<CollapsibleTrigger
									render={
										<SidebarMenuButton
											tooltip={item.title}
										/>
									}
								>
									{item.icon}
									<span>{item.title}</span>
									<ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items?.map((subItem) => (
											<SidebarMenuSubItem
												key={subItem.title}
											>
												<SidebarMenuSubButton
													isActive={
														pathname === subItem.url
													}
													render={
														<Link
															to={subItem.url}
														/>
													}
												>
													{subItem.icon}
													<span>{subItem.title}</span>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</Collapsible>
						))}
					</SidebarMenu>
				</SidebarGroup>

				{/* Hidden when collapsed to icons */}
				<SidebarGroup className="group-data-[collapsible=icon]:hidden">
					<SidebarGroupLabel>Recent</SidebarGroupLabel>
					{data.ideations.length === 0 ? (
						<p className="px-2 text-sm text-muted-foreground">
							Your ideations will appear here.
						</p>
					) : (
						<SidebarMenu>
							{data.ideations.map((item) => {
								const to = `/ideas/${encodeURIComponent(item.generationId)}`;

								return (
									<SidebarMenuItem key={item.generationId}>
										<SidebarMenuButton
											isActive={pathname === to}
											render={<Link to={to} />}
										>
											{item.icon}
											<span className="truncate">
												{item.name}
											</span>
										</SidebarMenuButton>
										<DropdownMenu>
											<DropdownMenuTrigger
												render={
													<SidebarMenuAction
														showOnHover
														className="aria-expanded:bg-muted"
													/>
												}
											>
												<MoreHorizontalIcon />
												<span className="sr-only">
													More
												</span>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												className="w-fit"
												side={
													isMobile
														? "bottom"
														: "right"
												}
												align={
													isMobile ? "end" : "start"
												}
											>
												<DropdownMenuItem>
													<FolderIcon />
													<span>View Ideation</span>
												</DropdownMenuItem>
												<DropdownMenuItem>
													<ArrowRightIcon />
													<span>Share Ideation</span>
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem variant="destructive">
													<Trash2Icon />
													<span>Delete Ideation</span>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</SidebarMenuItem>
								);
							})}
							<SidebarMenuItem>
								<SidebarMenuButton className="text-sidebar-foreground/70">
									<MoreHorizontalIcon className="text-sidebar-foreground/70" />
									<span>More</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					)}
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<WorkspaceUserMenu />
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
