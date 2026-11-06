import { cn } from "@/lib/utils";

/**
 * The visual for a presence status. Used on the avatar trigger and
 * inside the status row so both agree on color and size.
 *
 * The status is currently local state (see AccountMenu). When the
 * backend grows a `/auth/me { status }` mutation, this stays the
 * same — only the source of `status` changes.
 */
const STATUS_TONE = {
	online: "bg-emerald-500",
	away: "bg-amber-400",
	busy: "bg-red-500",
	offline: "bg-muted-foreground/50",
};

export const STATUS_OPTIONS = [
	{ value: "online", label: "Online" },
	{ value: "away", label: "Away" },
	{ value: "busy", label: "Do not disturb" },
	{ value: "offline", label: "Appear offline" },
];

export default function StatusDot({ status = "online", className }) {
	return (
		<span
			aria-hidden="true"
			className={cn(
				"block rounded-full ring-2 ring-background",
				STATUS_TONE[status] ?? STATUS_TONE.offline,
				className,
			)}
		/>
	);
}
