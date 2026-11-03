import { cn } from "@/lib/index.js";

export function Container({ children, className = "" }) {
	return (
		<div className={cn("container mx-auto", "px-6", ":px-10", className)}>
			{children}
		</div>
	);
}
