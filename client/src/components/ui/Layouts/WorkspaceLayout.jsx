import { Outlet } from "react-router-dom";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import WorkspaceSidebar from "@/components/custom/workspace/WorkspaceSidebar.jsx";
import WorkspaceTopBar from "@/components/custom/workspace/WorkspaceTopBar.jsx";

/**
 * Authenticated shell: collapsible sidebar + slim top bar.
 * No marketing header, no footer. Pages keep rendering their own <Container>.
 */
export default function WorkspaceLayout() {
	return (
		<SidebarProvider>
			<WorkspaceSidebar />

			<SidebarInset>
				<WorkspaceTopBar />

				<div
					id="main-content"
					className="flex flex-1 flex-col gap-4 p-4 pt-0"
				>
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
