/**
|--------------------------------------------------
| Sign-out with press-and-hold confirmation
|--------------------------------------------------
*/

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib";
import { LogOutIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function HoldToSignOut({ duration = 900, onSignOut }) {
	const [holding, setHolding] = useState(false);
	const timerRef = useRef(null);

	useEffect(() => {
		return () => window.clearTimeout(timerRef.current);
	}, []);

	function start() {
		if (timerRef.current !== null) return;
		setHolding(true);
		timerRef.current = window.setTimeout(() => {
			timerRef.current = null;
			setHolding(false);
			onSignOut?.();
		}, duration);
	}

	function cancel() {
		if (timerRef.current === null) return;
		window.clearTimeout(timerRef.current);
		timerRef.current = null;
		setHolding(false);
	}

	return (
		<DropdownMenuItem
			// Radix intercepts click to close the menu; we want the
			// press-and-hold interaction to play out, so prevent the
			// default "activate on click" behavior.
			onSelect={(event) => event.preventDefault()}
			onPointerDown={(event) => {
				if (event.button !== 0) return;
				event.currentTarget.setPointerCapture(event.pointerId);
				start();
			}}
			onPointerUp={cancel}
			onPointerCancel={cancel}
			onPointerLeave={cancel}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					if (!event.repeat) start();
				}
			}}
			onKeyUp={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					cancel();
				}
			}}
			onBlur={cancel}
			className="relative touch-none select-none"
		>
			<LogOutIcon className="size-4 text-muted-foreground" />

			<span className="flex-1">
				{holding ? "Keep holding…" : "Sign out"}
			</span>

			<span className="text-[10px] uppercase tracking-wider text-muted-foreground">
				Hold
			</span>

			{/* Progress fill */}
			<span
				aria-hidden="true"
				className={cn(
					"pointer-events-none absolute inset-1 rounded-md bg-foreground/5",
					"transition-[clip-path] duration-150 ease-linear",
				)}
				style={{
					clipPath: holding
						? "inset(0 0 0 0 round 0.375rem)"
						: "inset(0 100% 0 0 round 0.375rem)",
					transitionDuration: holding ? `${duration}ms` : "150ms",
				}}
			/>
		</DropdownMenuItem>
	);
}
