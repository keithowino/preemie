Each phase should be completed and verified before moving to the next.

## Phase 1 — Frontend architecture and dependencies ( presumed to be complete )

Start here

Establish the frontend foundation without building the screens yet.

Before installing packages or creating feature files, inspect the current client/src/app exports, environment configuration, and existing lint/build results. This will establish the exact changes needed without disturbing the working setup.

- Confirm the existing src/app exports and routing conventions.
- Decide where API configuration, API functions, shared components, layouts and feature pages belong.
- Install and configure @tanstack/react-query.
- Configure a shared QueryClient through AppProviders.jsx.
- Define route-level loading and error handling responsibilities.
- Verify the existing Vite build and ESLint checks.
  Deliverable: A stable frontend foundation ready for feature implementation.

## Phase 2 — Visual foundation and application shell ( presumed to be complete )

Establish the visual identity before adding complex interactions.

A. Visual direction: industrial editorial

Preemie should feel like an engineering notebook combined with a modern product-design studio. The interface should emphasize materials, practical experimentation, feasibility and build instructions rather than resemble a generic AI dashboard.

- Define the Sage, Signal Orange, Graphite and Warm Canvas palette.
- Configure typography using Inter and Manrope.
    - decisions:
        - Manrope: Display headings and prominent page titles.
        - Inter: Body text, form labels, navigation, metadata and controls.
        - System fallbacks: Keep text readable if web fonts cannot load.

- Establish reusable buttons, inputs, cards, badges, spacing and focus states.
- Build the shared application layout and responsive navigation.

```text
client/src/lib/components/
├── layouts/
│   ├── AppShell.jsx
│   ├── AppHeader.jsx
│   └── AppFooter.jsx
├── ScrollToTop.jsx
└── index.js
```

- Update index.css, tailwind.config.js and the HTML metadata where necessary.
  Deliverable: A consistent, responsive design system with an application shell.

## Phase 3 — Home page and input experience ( covered )

Build the first complete user-facing screen.

Create response: The supplied example demonstrates the retrieval response, not the complete response returned by POST. Confirm its envelope and generation ID location before implementing navigation.

- Create the headline, introduction and primary call to action.
- Implement a repeatable materials editor with name, quantity, unit and condition.
- Add goal, environment, skill level and notes inputs.
- Provide selectable example material sets.
- Validate the input before submitting it.
- Handle submission state and prevent accidental duplicate requests.
  Deliverable: Users can prepare valid ideation requests through the interface.

## Phase 4 — API integration and generation flow ( covered )

Connect the form to the existing backend.

- Create a centralized HTTP/API client using the configured API base URL.
- Implement the POST /api/v1/ideations request.
- Validate the response shape needed by the frontend.
- Extract generationId from the successful response.
- Navigate to /ideas/:generationId.
- Handle validation errors, rate limits, provider failures, network errors and timeouts.
  Deliverable: A submitted form creates a persisted generation and navigates to its results.

## Phase 5 — Ideas comparison page ( partially covered )

Implement the decision-making screen using persisted API data.

- Fetch GET /api/v1/ideations/:generationId.
- Display the original materials and constraints.
- Render exactly three concept cards.
- Compare concept type, summary, feasibility, complexity and required materials.
- Distinguish available materials from additional requirements.
- Link each card to its project workspace.
- Support loading, error, retry and invalid-generation states.
  Deliverable: Users can understand the alternatives and select a concept.

## Phase 6 — Project workspace

Turn the selected concept into an actionable build guide.

Concept selection: The workspace route identifies a concept by ideaId. Confirm that this is the concept's id in the persisted concepts array, and derive the workspace from the retrieved generation. A separate concept API endpoint is not required by the supplied contract.

- Resolve the requested concept using generationId and ideaId.
- Present its rationale, feasibility and complexity.
- Display the bill of materials and tools.
- Render ordered assembly instructions and checkpoints.
- Explain scientific principles, assumptions and limitations.
- Highlight safety warnings and validation tests.
- Provide navigation back to the other concepts.
  Deliverable: Users can follow a structured project plan based on the selected concept.

## Phase 7 — Integration testing and responsive refinement

Verify the complete workflow rather than only individual components.

- Test successful generation and retrieval.
- Test invalid inputs, missing generations and API failures.
- Verify refresh and direct navigation on both dynamic routes.
- Check smaller screens, keyboard navigation and visible focus states.
- Confirm that API failures do not leave stale or misleading results.
- Run ESLint and production builds.
  Deliverable: A verified end-to-end frontend experience.

## Phase 8 — Documentation and release readiness

- Document frontend architecture and feature organization.
- Document environment variables and API configuration.
- Record installation, development, lint and build commands.
- Update the project README and known limitations.
- Verify production routing and deployment configuration.
  Deliverable: A documented, deployable MVP.

---

React Query should manage server state, caching, loading and error states. Local form state should manage the materials editor and unsent constraints. We should not duplicate retrieved generations in a separate global state store.

---

## Route-level loading and error responsibilities

We should distinguish between navigation errors, data-fetching errors and form-submission errors. They have different causes and should not all be handled by one generic loading screen.

| Situation                           | Where it belongs      | Expected behavior                                                          |
| ----------------------------------- | --------------------- | -------------------------------------------------------------------------- |
| Initial page navigation             | Route/page            | Render the requested page                                                  |
| Generation submission               | Home page             | Show submission progress and disable duplicate submissions                 |
| Loading a generation                | Ideas page            | Show a skeleton or loading indicator                                       |
| Generation not found                | Ideas page            | Explain that the generation could not be found and provide navigation home |
| Retrieval network/server failure    | Ideas page            | Show a recoverable error and a retry action                                |
| Loading a selected concept          | Workspace page        | Show workspace loading state while retrieving the generation               |
| Invalid concept ID                  | Workspace page        | Explain that the requested concept was not found                           |
| Unexpected rendering or route error | Router error boundary | Render a controlled fallback rather than a blank screen                    |

React Query will manage asynchronous query states, but it does not replace route-level error handling.

When we implement the routes, React Router's errorElement or equivalent route error-boundary mechanism can handle unexpected route errors. Expected API failures should remain within the relevant page so that users can retry without losing their context.

---

I recommend these frontend behaviors:

Revoke another device Send DELETE request, then refresh the session list.
Revoke current device Clear local credentials and navigate to login after successful revocation.
Revoke other sessions Keep the current session authenticated and refresh the list.
Session list request fails Display an error and allow retry; do not silently show an empty list.
No active sessions returned Display an appropriate empty state.

For the current device, I recommend showing a This device indicator and providing an explicit sign-out action rather than an ordinary revoke button. This makes the consequences clearer.

Other presentation decisions:

- Display missing device information as Unknown device, rather than leaving blank headings.
- Format dates using the browser's local timezone.
- Display IP addresses only when supplied.
- Require confirmation before revoking other sessions.
- Refresh the session list after successful mutations.

## Implementation plan

We can now follow this sequence:

1. Extend identity.service.js with the three session-management methods and response validation.
2. Add session-management state and operations to the appropriate frontend identity layer.
3. Build the session-management page and individual session components.
4. Integrate the page into protected routing and navigation.
5. Test the API integration and user interactions.
6. Update the documentation.

---

I might need to implement such an architecture for headings:

```html
<h3 class="flex scroll-m-28 flex-row items-center gap-2 undefined" id="urls">
	<a data-card="" class="peer" href="?id=urls#urls">URLs</a
	><svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="lucide lucide-link size-3.5 shrink-0 text-fd-muted-foreground opacity-0 transition-opacity peer-hover:opacity-100"
		aria-label="Link to section"
	>
		<path
			d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
		></path>
		<path
			d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
		></path>
	</svg>
</h3>
```

What is eventOrValue, ~\client\src\modules\identity\components\AuthTextField.jsx.

---

- I might use the following component as a point of reference when it will come to matters such as:
    - User owning more than 1 account(Switching of accounts).
    - Theme persistence.

```jsx
"use client";
/**
 * @author: @dorianbaffier
 * @description: Account Menu
 * @version: 2.0.0
 * @date: 2026-10-14
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import {
	Check,
	ChevronLeft,
	ChevronRight,
	ChevronsUpDown,
	CreditCard,
	LogOut,
	Monitor,
	Moon,
	Plus,
	Settings,
	Sun,
	User,
} from "lucide-react";
import {
	animate,
	motion,
	useMotionTemplate,
	useMotionValue,
	useReducedMotion,
} from "motion/react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const SAMPLE_ACCOUNTS = [
	{
		id: "studio",
		name: "Fieldwork Studio",
		email: "team@fieldwork.studio",
		plan: "Team",
	},
	{
		id: "personal",
		name: "Maya Ortega",
		email: "maya@ortega.me",
		plan: "Pro",
	},
	{
		id: "side",
		name: "Night Shift",
		email: "hello@nightshift.dev",
		plan: "Free",
	},
];

const SAMPLE_ITEMS = [
	{ label: "Profile", icon: <User className="size-4" /> },
	{
		label: "Settings",
		icon: <Settings className="size-4" />,
		value: "⌘,",
	},
	{ label: "Billing", icon: <CreditCard className="size-4" /> },
];

const STATUSES = [
	{ id: "online", label: "Online", name: "Online", dot: "bg-emerald-500" },
	{ id: "away", label: "Away", name: "Away", dot: "bg-amber-400" },
	{ id: "busy", label: "DND", name: "Do not disturb", dot: "bg-red-500" },
];

const THEMES = [
	{ id: "light", label: "Light", Icon: Sun },
	{ id: "dark", label: "Dark", Icon: Moon },
	{ id: "system", label: "System", Icon: Monitor },
];

const AVATAR_TONES = [
	"bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900",
	"bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-100",
	"bg-zinc-100 text-zinc-500 ring-1 ring-zinc-200 ring-inset dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700",
];

const WHITESPACE = /\s+/;
const PANEL_W = 288;
const RADIUS = 16;
const SPRING = { type: "spring", duration: 0.3, bounce: 0 };
const INDICATOR_SPRING = {
	type: "spring",
	duration: 0.25,
	bounce: 0,
};
const INSTANT = { duration: 0 };
const EASE_OUT = [0.23, 1, 0.32, 1];
const NAV_KEYS = new Set([
	"ArrowDown",
	"ArrowUp",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
]);

const ITEM_CLASS =
	"flex w-full cursor-default items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-left text-sm text-zinc-700 outline-none transition-colors duration-100 focus:bg-zinc-100 focus:text-zinc-950 dark:text-zinc-300 dark:focus:bg-zinc-800 dark:focus:text-zinc-50";

function initialsOf(account) {
	if (account.initials) {
		return account.initials;
	}
	return account.name
		.split(WHITESPACE)
		.slice(0, 2)
		.map((part) => part[0] ?? "")
		.join("")
		.toUpperCase();
}

function viaOf(event) {
	// A click fired by Enter or Space carries no pointer detail.
	return event.detail === 0 ? "keyboard" : "pointer";
}

function menuItems(root) {
	if (!root) {
		return [];
	}
	return Array.from(root.querySelectorAll("[data-menu-item]"));
}

function sideTarget(items, current, step) {
	const row = items.filter(
		(item) => item.dataset.row === current.dataset.row,
	);
	if (row.length < 2) {
		return;
	}
	const index = row.indexOf(current);
	return row[(index + step + row.length) % row.length];
}

function rowTarget(items, current, step) {
	const rows = [...new Set(items.map((item) => item.dataset.row))];
	const index = rows.indexOf(current.dataset.row);
	const next = rows[(index + step + rows.length) % rows.length];
	const candidates = items.filter((item) => item.dataset.row === next);
	return (
		candidates.find(
			(item) => item.getAttribute("aria-checked") === "true",
		) ?? candidates[0]
	);
}

/** Where arrow keys move focus: rows go up and down, radios left and right. */
function nextTarget(items, active, key) {
	if (key === "Home") {
		return items[0];
	}
	if (key === "End") {
		return items.at(-1);
	}
	const current = items.find((item) => item === active);
	if (!current) {
		return key === "ArrowUp" ? items.at(-1) : items[0];
	}
	if (key === "ArrowLeft" || key === "ArrowRight") {
		return sideTarget(items, current, key === "ArrowRight" ? 1 : -1);
	}
	return rowTarget(items, current, key === "ArrowDown" ? 1 : -1);
}

function useControllable(value, fallback, onChange) {
	const [local, setLocal] = useState(fallback);
	const set = (next) => {
		setLocal(next);
		onChange?.(next);
	};
	return [value ?? local, set];
}

function Avatar({ account, tone, status, className }) {
	const dot = STATUSES.find((entry) => entry.id === status)?.dot;
	return (
		<span
			aria-hidden="true"
			className={cn(
				"relative grid shrink-0 select-none place-items-center rounded-full font-medium text-[11px] tracking-wide",
				AVATAR_TONES[tone % AVATAR_TONES.length],
				className,
			)}
		>
			{initialsOf(account)}
			{dot ? (
				<span
					className={cn(
						"absolute right-0 bottom-0 size-2.5 rounded-full ring-2 ring-white transition-colors duration-200 dark:ring-zinc-900",
						dot,
					)}
				/>
			) : null}
		</span>
	);
}

/**
 * The avatar, name and email. Rendered in the trigger while the menu is
 * closed and in the menu header while it is open; shared layout ids let the
 * three pieces travel between the two places.
 */
function Identity({ uid, shared, account, tone, status, transition, stacked }) {
	const hidden = shared ? undefined : "invisible";
	return (
		<span
			className={cn(
				"flex min-w-0",
				stacked ? "flex-col items-start gap-3" : "items-center gap-2.5",
			)}
		>
			<motion.span
				className={cn("relative z-20 block", hidden)}
				key={shared ? "avatar-shared" : "avatar-static"}
				layoutId={shared ? `${uid}-avatar` : undefined}
				transition={transition}
			>
				<Avatar
					account={account}
					className={stacked ? "size-10" : "size-8"}
					status={status}
					tone={tone}
				/>
			</motion.span>
			<span className="flex min-w-0 flex-col text-left">
				<motion.span
					className={cn(
						"relative z-20 block truncate font-medium text-sm text-zinc-900 leading-5 dark:text-zinc-100",
						hidden,
					)}
					key={shared ? "name-shared" : "name-static"}
					layoutId={shared ? `${uid}-name` : undefined}
					transition={transition}
				>
					{account.name}
				</motion.span>
				<motion.span
					className={cn(
						"relative z-20 block truncate text-xs text-zinc-500 leading-4 dark:text-zinc-400",
						hidden,
					)}
					key={shared ? "email-shared" : "email-static"}
					layoutId={shared ? `${uid}-email` : undefined}
					transition={transition}
				>
					{account.email}
				</motion.span>
			</span>
		</span>
	);
}

function Separator() {
	return (
		<hr className="mx-2.5 my-1.5 h-px border-0 bg-zinc-100 dark:bg-zinc-800" />
	);
}

function HoldSignOut({ duration, onComplete }) {
	const [holding, setHolding] = useState(false);
	const [done, setDone] = useState(false);
	const [nudge, setNudge] = useState(false);
	const timer = useRef(undefined);
	const nudgeTimer = useRef(undefined);

	useEffect(
		() => () => {
			window.clearTimeout(timer.current);
			window.clearTimeout(nudgeTimer.current);
		},
		[],
	);

	const start = (via) => {
		if (timer.current !== undefined || done) {
			return;
		}
		window.clearTimeout(nudgeTimer.current);
		setNudge(false);
		setHolding(true);
		timer.current = window.setTimeout(() => {
			timer.current = undefined;
			setHolding(false);
			setDone(true);
			onComplete(via);
		}, duration);
	};

	const cancel = () => {
		if (timer.current === undefined) {
			return;
		}
		window.clearTimeout(timer.current);
		timer.current = undefined;
		setHolding(false);
		setNudge(true);
		nudgeTimer.current = window.setTimeout(() => setNudge(false), 1400);
	};

	const label = (
		<>
			<LogOut className="size-4" />
			<span className="flex-1">Sign out</span>
			<span className="text-xs opacity-60">
				{nudge ? "Keep holding" : "Hold"}
			</span>
		</>
	);

	return (
		<button
			className={cn(ITEM_CLASS, "relative touch-none select-none")}
			data-menu-item=""
			data-row="sign-out"
			onBlur={cancel}
			onClick={(event) => event.preventDefault()}
			onContextMenu={(event) => event.preventDefault()}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					if (!event.repeat) {
						start("keyboard");
					}
				}
			}}
			onKeyUp={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					cancel();
				}
			}}
			onPointerCancel={cancel}
			onPointerDown={(event) => {
				if (event.button !== 0) {
					return;
				}
				event.currentTarget.setPointerCapture(event.pointerId);
				start("pointer");
			}}
			onPointerUp={cancel}
			role="menuitem"
			tabIndex={-1}
			type="button"
		>
			{label}
			<span className="sr-only">, press and hold to confirm</span>
			{/* The fill: an inverted copy of the row, revealed left to right. */}
			<span
				aria-hidden="true"
				className="absolute inset-0 flex items-center gap-2.5 rounded-[10px] bg-zinc-900 px-2.5 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
				style={{
					clipPath:
						holding || done
							? "inset(0 0 0 0 round 10px)"
							: "inset(0 100% 0 0 round 10px)",
					transition: holding
						? `clip-path ${duration}ms linear`
						: "clip-path 240ms cubic-bezier(0.23, 1, 0.32, 1)",
				}}
			>
				{label}
			</span>
		</button>
	);
}

function StatusRow({ status, onChange }) {
	return (
		<fieldset
			aria-label="Status"
			className="m-0 flex min-w-0 items-center justify-between border-0 py-1 pr-1 pl-2.5"
		>
			<span className="text-sm text-zinc-500 dark:text-zinc-400">
				Status
			</span>
			<span className="flex">
				{STATUSES.map((entry) => {
					const checked = entry.id === status;
					return (
						<button
							aria-checked={checked}
							aria-label={entry.name}
							className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-zinc-500 outline-none transition-colors duration-100 focus:bg-zinc-100 aria-checked:text-zinc-900 dark:text-zinc-400 dark:aria-checked:text-zinc-100 dark:focus:bg-zinc-800"
							data-menu-item=""
							data-row="status"
							key={entry.id}
							onClick={() => onChange(entry.id)}
							role="menuitemradio"
							tabIndex={-1}
							type="button"
						>
							<span
								className={cn(
									"size-2 rounded-full transition-colors duration-200",
									checked
										? entry.dot
										: "bg-zinc-300 dark:bg-zinc-600",
								)}
							/>
							{entry.label}
						</button>
					);
				})}
			</span>
		</fieldset>
	);
}

function ThemeRow({ uid, theme, onChange, reduced }) {
	return (
		<fieldset
			aria-label="Theme"
			className="m-0 flex min-w-0 items-center justify-between border-0 py-1 pr-1 pl-2.5"
		>
			<span className="text-sm text-zinc-500 dark:text-zinc-400">
				Theme
			</span>
			<span className="flex rounded-[10px] bg-zinc-100 p-0.5 dark:bg-zinc-800">
				{THEMES.map(({ id, label, Icon }) => {
					const checked = id === theme;
					return (
						<button
							aria-checked={checked}
							aria-label={label}
							className="relative grid h-7 w-9 place-items-center rounded-lg text-zinc-500 outline-none transition-colors duration-150 hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 aria-checked:text-zinc-900 dark:text-zinc-400 dark:aria-checked:text-zinc-50 dark:hover:text-zinc-200"
							data-menu-item=""
							data-row="theme"
							key={id}
							onClick={() => onChange(id)}
							role="menuitemradio"
							tabIndex={-1}
							type="button"
						>
							{checked ? (
								<motion.span
									className="absolute inset-0 rounded-lg bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08)] dark:bg-zinc-700"
									layoutId={`${uid}-theme`}
									transition={
										reduced ? INSTANT : INDICATOR_SPRING
									}
								/>
							) : null}
							<Icon className="relative size-3.5" />
						</button>
					);
				})}
			</span>
		</fieldset>
	);
}

function LinkItem({ item, index, onSelect }) {
	const inner = (
		<>
			<span className="text-zinc-400 dark:text-zinc-500">
				{item.icon}
			</span>
			<span className="flex-1">{item.label}</span>
			{item.value ? (
				<span className="text-xs text-zinc-400 dark:text-zinc-500">
					{item.value}
				</span>
			) : null}
		</>
	);
	const common = {
		className: ITEM_CLASS,
		"data-menu-item": "",
		"data-row": `item-${index}`,
		onClick: (event) => onSelect(event, item.onSelect),
		role: "menuitem",
		tabIndex: -1,
	};
	if (item.href) {
		return (
			<a
				{...common}
				href={item.href}
				{...(item.external && {
					rel: "noopener noreferrer",
					target: "_blank",
				})}
			>
				{inner}
			</a>
		);
	}
	return (
		<button {...common} type="button">
			{inner}
		</button>
	);
}

export default function ProfileDropdown({
	accounts = SAMPLE_ACCOUNTS,
	defaultAccountId = "personal",
	onAccountChange,
	onAddAccount,
	items = SAMPLE_ITEMS,
	theme: themeProp,
	defaultTheme = "system",
	onThemeChange,
	status: statusProp,
	defaultStatus = "online",
	onStatusChange,
	onSignOut,
	holdDuration = 1200,
	className,
	...props
}) {
	const uid = useId();
	const reduced = useReducedMotion() === true;
	const [phase, setPhase] = useState("closed");
	const [instant, setInstant] = useState(false);
	const [page, setPage] = useState("main");
	const [openSeq, setOpenSeq] = useState(0);
	const [accountId, setAccountId] = useState(
		defaultAccountId ?? accounts[0]?.id,
	);
	const [theme, setTheme] = useControllable(
		themeProp,
		defaultTheme,
		onThemeChange,
	);
	const [status, setStatus] = useControllable(
		statusProp,
		defaultStatus,
		onStatusChange,
	);

	const wrapperRef = useRef(null);
	const triggerRef = useRef(null);
	const mainRef = useRef(null);
	const accountsRef = useRef(null);
	const phaseRef = useRef("closed");
	phaseRef.current = phase;
	const openIntent = useRef({ focus: "menu", resume: false });
	const pageFocus = useRef(null);
	const closeSeq = useRef(0);
	const targetH = useRef(0);

	// The panel's visible box. The two surface layers (border and fill) and the
	// content all clip to it, so the menu grows out of the trigger's own
	// rectangle without any layout work per frame.
	const w = useMotionValue(0);
	const h = useMotionValue(0);
	const pageX = useMotionValue(0);
	const bodyOpacity = useMotionValue(1);
	const outerClip = useMotionTemplate`inset(0px 0px calc(100% - ${h}px) calc(100% - ${w}px) round ${RADIUS}px)`;
	const innerClip = useMotionTemplate`inset(1px 1px calc(100% - ${h}px + 1px) calc(100% - ${w}px + 1px) round ${RADIUS - 1}px)`;
	const pageTransform = useMotionTemplate`translate3d(${pageX}px, 0, 0)`;

	const account = accounts.find((entry) => entry.id === accountId) ??
		accounts[0] ?? { id: "guest", name: "Guest", email: "" };
	const tone = Math.max(0, accounts.indexOf(account));
	const others = accounts.filter((entry) => entry.id !== account.id);
	const sharedTransition = instant ? INSTANT : SPRING;
	const sharedInPanel = phase === "open";
	const menuId = `${uid}-menu`;

	const pageEl = (target) =>
		target === "main" ? mainRef.current : accountsRef.current;

	const openMenu = (via, focus) => {
		if (phaseRef.current === "open") {
			return;
		}
		openIntent.current = { focus, resume: phaseRef.current === "closing" };
		closeSeq.current += 1;
		setInstant(via === "keyboard" || reduced);
		setPage("main");
		setPhase("open");
		setOpenSeq((seq) => seq + 1);
	};

	const closeMenu = (via, returnFocus) => {
		if (phaseRef.current !== "open") {
			return;
		}
		const trigger = triggerRef.current;
		if (returnFocus) {
			trigger?.focus({ preventScroll: true });
		}
		if (via === "keyboard" || reduced || !trigger) {
			setInstant(true);
			setPhase("closed");
			return;
		}
		setInstant(false);
		setPhase("closing");
		const seq = ++closeSeq.current;
		animate(bodyOpacity, 0, { duration: 0.12, ease: EASE_OUT });
		animate(w, trigger.offsetWidth, SPRING);
		animate(h, trigger.offsetHeight, SPRING).then(() => {
			if (closeSeq.current === seq) {
				setPhase("closed");
			}
		});
	};

	const goTo = (target) => {
		pageFocus.current = target === "accounts" ? "first" : "switch";
		setPage(target);
	};

	const select = (event, run) => {
		run?.();
		closeMenu(viaOf(event), true);
	};

	// Opening: size the clip to the trigger, then spring it out to the menu.
	// A keyboard open skips straight to the end.
	// biome-ignore lint/correctness/useExhaustiveDependencies: runs once per open
	useLayoutEffect(() => {
		const trigger = triggerRef.current;
		const main = mainRef.current;
		if (openSeq === 0 || phaseRef.current !== "open" || !trigger || !main) {
			return;
		}
		pageX.jump(0);
		targetH.current = main.offsetHeight;
		if (instant) {
			w.jump(PANEL_W);
			h.jump(targetH.current);
			bodyOpacity.jump(1);
		} else {
			if (!openIntent.current.resume) {
				w.jump(trigger.offsetWidth);
				h.jump(trigger.offsetHeight);
				bodyOpacity.jump(0);
			}
			animate(w, PANEL_W, SPRING);
			animate(h, targetH.current, SPRING);
			animate(bodyOpacity, 1, {
				duration: 0.2,
				delay: 0.05,
				ease: EASE_OUT,
			});
		}
		const list = menuItems(main);
		const targets = {
			first: list[0],
			last: list.at(-1),
			menu: main.querySelector("[role=menu]"),
		};
		targets[openIntent.current.focus]?.focus({ preventScroll: true });
	}, [openSeq]);

	// Switching pages: push sideways and spring the height to the new page.
	// biome-ignore lint/correctness/useExhaustiveDependencies: keyed on page
	useEffect(() => {
		const el = pageEl(page);
		if (phaseRef.current !== "open" || !el) {
			return;
		}
		const x = page === "main" ? 0 : -PANEL_W;
		targetH.current = el.offsetHeight;
		if (reduced) {
			pageX.jump(x);
			h.jump(targetH.current);
		} else {
			animate(pageX, x, SPRING);
			animate(h, targetH.current, SPRING);
		}
		const intent = pageFocus.current;
		pageFocus.current = null;
		if (intent === "first") {
			const list = menuItems(el);
			const checked = list.find(
				(item) => item.getAttribute("aria-checked") === "true",
			);
			(checked ?? list[0])?.focus({ preventScroll: true });
		} else if (intent === "switch") {
			el.querySelector("[data-switch]")?.focus({
				preventScroll: true,
			});
		}
	}, [page]);

	// Keep the height in step if a page's content changes size while open.
	// biome-ignore lint/correctness/useExhaustiveDependencies: observers read refs
	useEffect(() => {
		if (phase !== "open") {
			return;
		}
		const observer = new ResizeObserver(() => {
			const el = pageEl(page);
			if (!el || phaseRef.current !== "open") {
				return;
			}
			const next = el.offsetHeight;
			if (Math.abs(next - targetH.current) < 0.5) {
				return;
			}
			targetH.current = next;
			animate(h, next, reduced ? INSTANT : SPRING);
		});
		for (const el of [mainRef.current, accountsRef.current]) {
			if (el) {
				observer.observe(el);
			}
		}
		return () => observer.disconnect();
	}, [phase, page]);

	// A press anywhere outside closes, with the morph.
	// biome-ignore lint/correctness/useExhaustiveDependencies: closeMenu reads refs
	useEffect(() => {
		if (phase !== "open") {
			return;
		}
		const onDown = (event) => {
			if (!wrapperRef.current?.contains(event.target)) {
				closeMenu("pointer", false);
			}
		};
		document.addEventListener("pointerdown", onDown, true);
		return () => document.removeEventListener("pointerdown", onDown, true);
	}, [phase]);

	const onPanelKeyDown = (event) => {
		if (event.key === "Escape" || event.key === "Tab") {
			event.preventDefault();
			closeMenu("keyboard", true);
			return;
		}
		if (page === "accounts" && event.key === "Backspace") {
			event.preventDefault();
			goTo("main");
			return;
		}
		if (!NAV_KEYS.has(event.key)) {
			return;
		}
		event.preventDefault();
		const active = document.activeElement;
		const target = nextTarget(menuItems(pageEl(page)), active, event.key);
		if (target) {
			target.focus({ preventScroll: true });
		} else if (page === "accounts" && event.key === "ArrowLeft") {
			goTo("main");
		} else if (
			event.key === "ArrowRight" &&
			active instanceof HTMLElement &&
			active.dataset.switch !== undefined
		) {
			goTo("accounts");
		}
	};

	// Hovering an item focuses it, so pointer and keyboard share one highlight.
	const onPanelPointerMove = (event) => {
		if (event.pointerType !== "mouse") {
			return;
		}
		const item = event.target.closest("[data-menu-item]");
		if (item && document.activeElement !== item) {
			item.focus({ preventScroll: true });
		}
	};

	return (
		<div
			className={cn(
				"relative isolate inline-block",
				phase !== "closed" && "z-50",
				className,
			)}
			ref={wrapperRef}
			{...props}
		>
			<button
				aria-controls={sharedInPanel ? menuId : undefined}
				aria-expanded={sharedInPanel}
				aria-haspopup="menu"
				className="flex w-60 items-center gap-2.5 rounded-2xl border border-zinc-200 bg-white p-2 pr-3 text-left outline-none transition-colors duration-150 hover:border-zinc-300 hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-zinc-800 dark:bg-zinc-900 dark:focus-visible:ring-zinc-500 dark:focus-visible:ring-offset-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/60"
				onClick={(event) => {
					const via = viaOf(event);
					openMenu(via, via === "keyboard" ? "first" : "menu");
				}}
				onKeyDown={(event) => {
					if (event.key === "ArrowDown" || event.key === "ArrowUp") {
						event.preventDefault();
						openMenu(
							"keyboard",
							event.key === "ArrowDown" ? "first" : "last",
						);
					}
				}}
				ref={triggerRef}
				type="button"
			>
				<span className="min-w-0 flex-1">
					<Identity
						account={account}
						shared={!sharedInPanel}
						stacked={false}
						status={status}
						tone={tone}
						transition={sharedTransition}
						uid={uid}
					/>
				</span>
				<ChevronsUpDown
					aria-hidden="true"
					className={cn(
						"size-4 shrink-0 text-zinc-400 transition-opacity duration-150 dark:text-zinc-500",
						phase !== "closed" && "opacity-0",
					)}
				/>
			</button>

			{phase === "closed" ? null : (
				<div
					className="pointer-events-none absolute top-0 right-0 z-10"
					style={{ width: PANEL_W }}
				>
					<div
						aria-hidden="true"
						className="absolute inset-0 [filter:drop-shadow(0_12px_24px_rgb(0_0_0/0.08))_drop-shadow(0_2px_4px_rgb(0_0_0/0.04))] dark:[filter:drop-shadow(0_12px_28px_rgb(0_0_0/0.5))]"
					>
						<motion.div
							className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800"
							style={{ clipPath: outerClip }}
						/>
						<motion.div
							className="absolute inset-0 bg-white dark:bg-zinc-900"
							style={{ clipPath: innerClip }}
						/>
					</div>
					<motion.div
						className={cn(
							"relative",
							sharedInPanel && "pointer-events-auto",
						)}
						onKeyDown={onPanelKeyDown}
						onPointerMove={onPanelPointerMove}
						style={{ clipPath: innerClip }}
					>
						<motion.div
							className="flex w-max items-start"
							style={{ transform: pageTransform }}
						>
							<div
								className={cn(
									"shrink-0 p-1.5 transition-opacity duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
									page !== "main" && "opacity-0",
								)}
								inert={page !== "main"}
								ref={mainRef}
								style={{ width: PANEL_W }}
							>
								<div className="flex items-start justify-between px-2.5 pt-2.5 pb-3">
									<Identity
										account={account}
										shared={sharedInPanel}
										stacked
										status={status}
										tone={tone}
										transition={sharedTransition}
										uid={uid}
									/>
									{account.plan ? (
										<motion.span
											className="shrink-0 pt-0.5 text-xs text-zinc-400 dark:text-zinc-500"
											style={{ opacity: bodyOpacity }}
										>
											{account.plan}
										</motion.span>
									) : null}
								</div>
								<motion.div
									aria-label={account.name}
									className="outline-none"
									id={menuId}
									role="menu"
									style={{ opacity: bodyOpacity }}
									tabIndex={-1}
								>
									<StatusRow
										onChange={setStatus}
										status={status}
									/>
									<ThemeRow
										onChange={setTheme}
										reduced={reduced}
										theme={theme}
										uid={uid}
									/>
									<Separator />
									{items.map((item, index) => (
										<LinkItem
											index={index}
											item={item}
											key={item.label}
											onSelect={select}
										/>
									))}
									{accounts.length > 1 ? (
										<button
											aria-expanded={page === "accounts"}
											aria-haspopup="menu"
											className={ITEM_CLASS}
											data-menu-item=""
											data-row="switch"
											data-switch=""
											onClick={() => goTo("accounts")}
											role="menuitem"
											tabIndex={-1}
											type="button"
										>
											<span className="flex -space-x-1.5">
												{others
													.slice(0, 2)
													.map((entry) => (
														<Avatar
															account={entry}
															className="size-5 text-[7px] tracking-normal ring-2 ring-white dark:ring-zinc-900"
															key={entry.id}
															tone={accounts.indexOf(
																entry,
															)}
														/>
													))}
											</span>
											<span className="flex-1">
												Switch account
											</span>
											<ChevronRight className="size-4 text-zinc-400 dark:text-zinc-500" />
										</button>
									) : null}
									<Separator />
									<HoldSignOut
										duration={holdDuration}
										onComplete={(via) => {
											onSignOut?.();
											closeMenu(via, true);
										}}
									/>
								</motion.div>
							</div>

							<div
								className={cn(
									"shrink-0 p-1.5 transition-opacity duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
									page !== "accounts" && "opacity-0",
								)}
								inert={page !== "accounts"}
								ref={accountsRef}
								style={{ width: PANEL_W }}
							>
								<motion.div
									aria-label="Switch account"
									className="outline-none"
									role="menu"
									style={{ opacity: bodyOpacity }}
									tabIndex={-1}
								>
									<button
										className={cn(
											ITEM_CLASS,
											"gap-1.5 pl-1.5 font-medium",
										)}
										data-menu-item=""
										data-row="back"
										onClick={() => goTo("main")}
										role="menuitem"
										tabIndex={-1}
										type="button"
									>
										<ChevronLeft className="size-4 text-zinc-400 dark:text-zinc-500" />
										<span className="sr-only">
											Back to{" "}
										</span>
										Switch account
									</button>
									<Separator />
									{accounts.map((entry, index) => {
										const checked = entry.id === account.id;
										return (
											<button
												aria-checked={checked}
												className={ITEM_CLASS}
												data-menu-item=""
												data-row={`account-${entry.id}`}
												key={entry.id}
												onClick={() => {
													if (!checked) {
														setAccountId(entry.id);
														onAccountChange?.(
															entry,
														);
													}
													goTo("main");
												}}
												role="menuitemradio"
												tabIndex={-1}
												type="button"
											>
												<Avatar
													account={entry}
													className="size-7"
													status={
														checked
															? status
															: undefined
													}
													tone={index}
												/>
												<span className="flex min-w-0 flex-1 flex-col">
													<span className="truncate text-zinc-900 dark:text-zinc-100">
														{entry.name}
													</span>
													<span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
														{entry.email}
													</span>
												</span>
												{checked ? (
													<Check className="size-4 text-zinc-900 dark:text-zinc-100" />
												) : null}
											</button>
										);
									})}
									<Separator />
									<button
										className={ITEM_CLASS}
										data-menu-item=""
										data-row="add"
										onClick={(event) =>
											select(event, onAddAccount)
										}
										role="menuitem"
										tabIndex={-1}
										type="button"
									>
										<span className="grid size-7 place-items-center rounded-full border border-zinc-300 border-dashed text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
											<Plus className="size-3.5" />
										</span>
										Add account
									</button>
								</motion.div>
							</div>
						</motion.div>
					</motion.div>
				</div>
			)}
		</div>
	);
}
```

---
