import { useLayoutEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";

import { platform } from "../../../lib/index.js";
import { useIdentity } from "../../../platform/index.js";

import AccountMenu from "@/modules/identity/components/AccountMenu.jsx";
import MobileNav from "@/modules/identity/components/MobileNav.jsx";

const TAGLINE = ["Make.", "Test.", "Improve."];

const NAV_LINKS = [
	{ to: "/community", label: "Community" },
	{ to: "/museum", label: "Museum" },
];

export default function AppHeader() {
	const { isAuthenticated, logout } = useIdentity();
	const navigate = useNavigate();
	const taglineRef = useRef(null);

	useLayoutEffect(() => {
		const mm = gsap.matchMedia();

		mm.add("(prefers-reduced-motion: no-preference)", () => {
			const ctx = gsap.context(() => {
				const tl = gsap.timeline({ delay: 0.3 });

				tl.from("[data-word]", {
					yPercent: 110,
					opacity: 0,
					duration: 0.7,
					ease: "power3.out",
					stagger: 0.18,
				}).from(
					"[data-underline]",
					{
						scaleX: 0,
						transformOrigin: "left center",
						duration: 0.5,
						ease: "power2.out",
					},
					"-=0.2",
				);
			}, taglineRef);

			return () => ctx.revert();
		});

		return () => mm.revert();
	}, []);

	async function handleSignOut() {
		try {
			await logout();
		} catch {
			/**
			 * IdentityProvider clears the local session even when
			 * the server-side logout request fails.
			 */
		} finally {
			navigate("/", { replace: true });
		}
	}

	return (
		<header className="border-b border-border bg-background">
			<div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
				{/* Brand */}
				<Link
					to="/"
					aria-label="Preemie home"
					className="inline-flex shrink-0 items-center gap-3 rounded-md"
				>
					<span
						aria-hidden="true"
						className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-6 w-6"
						>
							<path d="M12 20v-8" />
							<path d="M12 13C5 13 4 7 4 4c6 0 10 3 8 9Z" />
							<path d="M12 16c0-5 3-8 8-8 0 4-2 8-8 8Z" />
						</svg>
					</span>

					<span className="flex flex-col">
						<span className="font-heading text-xl font-extrabold leading-tight tracking-tight text-foreground">
							{platform.name}
						</span>
						<span className="hidden text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:block">
							Ideas from what you have
						</span>
					</span>
				</Link>

				{/* Desktop nav */}
				<nav
					aria-label="Primary"
					className="hidden items-center gap-1 md:flex"
				>
					{NAV_LINKS.map((link) => (
						<Link
							key={link.to}
							to={link.to}
							className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						>
							{link.label}
						</Link>
					))}
				</nav>

				{/* Tagline — decorative, hidden once space is tight */}
				<span
					ref={taglineRef}
					aria-hidden="true"
					className="ml-auto hidden items-center gap-1.5 text-sm font-medium text-muted-foreground lg:flex"
				>
					{TAGLINE.map((word, i) => {
						const isLast = i === TAGLINE.length - 1;
						return (
							<span
								key={word}
								className="relative inline-block overflow-hidden pb-1"
							>
								<span data-word className="inline-block">
									{word}
								</span>
								{isLast && (
									<span
										data-underline
										aria-hidden="true"
										className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-secondary"
									/>
								)}
							</span>
						);
					})}
				</span>

				{/* Account */}
				<div className="ml-auto flex items-center gap-2 lg:ml-0">
					{isAuthenticated ? (
						<AccountMenu onSignOut={handleSignOut} />
					) : (
						<nav
							aria-label="Account"
							className="hidden items-center gap-2 md:flex"
						>
							<Link
								to="/login"
								className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
							>
								Sign in
							</Link>
							<Link
								to="/register"
								className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/85"
							>
								Create account
							</Link>
						</nav>
					)}

					{/* Mobile hamburger — always shown below md */}
					<div className="md:hidden">
						<MobileNav onSignOut={handleSignOut} />
					</div>
				</div>
			</div>
		</header>
	);
}
