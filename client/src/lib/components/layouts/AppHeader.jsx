import { useLayoutEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { platform } from "../../config/index.js";

import { gsap } from "gsap";
import { useIdentity } from "../../../platform/index.js";

const TAGLINE = ["Make.", "Test.", "Improve."];

export default function AppHeader() {
	const { isAuthenticated, user, logout } = useIdentity();
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
		await logout();
		navigate("/", { replace: true });
	}

	return (
		<header className="border-b border-border bg-canvas">
			<div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
				<Link
					to="/"
					aria-label="Preemie home"
					className="inline-flex items-center gap-3 rounded-md"
				>
					<span
						aria-hidden="true"
						className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage text-graphite"
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
						<span className="font-display text-xl font-extrabold leading-tight tracking-tight text-graphite">
							{platform.name}
						</span>
						<span className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted">
							Ideas from what you have
						</span>
					</span>
				</Link>

				<span
					ref={taglineRef}
					className="hidden items-center gap-1.5 text-sm font-medium text-muted sm:flex"
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
										className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-sage"
									/>
								)}
							</span>
						);
					})}
				</span>
				<div className="flex items-center gap-4">
					{isAuthenticated ? (
						<nav className="flex items-center gap-3 text-sm">
							<Link
								to="/sessions"
								className="font-medium text-graphite hover:underline"
							>
								{user.firstName
									? `Hi, ${user.firstName}`
									: "Sessions"}
							</Link>
							<button
								type="button"
								onClick={handleSignOut}
								className="font-medium text-muted hover:text-graphite"
							>
								Sign out
							</button>
						</nav>
					) : (
						<nav className="flex items-center gap-3 text-sm">
							<Link
								to="/login"
								className="font-medium text-graphite hover:underline"
							>
								Sign in
							</Link>
							<Link
								to="/register"
								className="rounded-control bg-graphite px-3 py-1.5 font-semibold text-white hover:bg-graphite/85"
							>
								Create account
							</Link>
						</nav>
					)}
				</div>
			</div>
		</header>
	);
}
