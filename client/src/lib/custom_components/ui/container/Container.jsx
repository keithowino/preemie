import { cn } from "../../../index.js";

export default function Container({ children, className = "" }) {
	return (
		<div className={cn("container mx-auto", "px-6", ":px-10", className)}>
			{children}
		</div>
	);
}
