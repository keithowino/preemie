import { useEffect, useState } from "react";

import {
	Heading,
	Loader,
	MetaDataInsert,
	Section,
} from "../../../lib/index.js";
import { Text } from "@/components/ui/typography/Text.jsx";
import { Container } from "@/components/ui/Layouts/container/index.js";

import { useIdentity, useNotify } from "../../../platform/index.js";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/custom/EmptyState.jsx";

/**
|--------------------------------------------------
| Formatting helpers
|--------------------------------------------------
*/

function formatDate(value) {
	if (!value) return "Not available";

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return "Not available";
	}

	return new Intl.DateTimeFormat(undefined, {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(date);
}

function getDeviceName(session) {
	if (session.deviceName) {
		return session.deviceName;
	}

	const deviceDetails = [session.browser, session.operatingSystem].filter(
		Boolean,
	);

	return deviceDetails.length > 0
		? deviceDetails.join(" · ")
		: "Unknown device";
}

function getSessionErrorMessage(error) {
	if (error?.code === "NETWORK_ERROR") {
		return "We couldn't connect to the server. Check your connection and try again.";
	}

	if (error?.status >= 500) {
		return "The service is temporarily unavailable. Please try again.";
	}

	return error?.message || "We couldn't retrieve your active sessions.";
}

export default function SessionsPage() {
	const notify = useNotify();
	const {
		sessions,
		isLoadingSessions,
		sessionsError,
		loadSessions,
		revokeSession,
		revokeOtherSessions,
	} = useIdentity();

	const [confirmingSessionId, setConfirmingSessionId] = useState(null);
	const [isConfirmingOtherSessions, setIsConfirmingOtherSessions] =
		useState(false);

	const [mutationInProgress, setMutationInProgress] = useState(null);
	const [mutationError, setMutationError] = useState(null);

	useEffect(() => {
		loadSessions();
	}, [loadSessions]);

	useEffect(() => {
		if (mutationError) {
			notify.error("Session action failed.", {
				description: getSessionErrorMessage(mutationError),
			});
		}

		if (sessionsError) {
			notify.error("Unable to retrieve sessions.", {
				description: getSessionErrorMessage(sessionsError),
			});
		}
	}, [sessionsError, mutationError]);

	/**
	|--------------------------------------------------
	| Derived values
	|--------------------------------------------------
	*/

	const otherSessions = sessions.filter((session) => !session.current);

	const hasOtherSessions = otherSessions.length > 0;

	async function handleRevokeSession(sessionId) {
		if (mutationInProgress) return;

		setMutationInProgress(sessionId);
		setMutationError(null);

		try {
			await revokeSession(sessionId);

			setConfirmingSessionId(null);
		} catch (error) {
			setMutationError(error);
		} finally {
			setMutationInProgress(null);
		}
	}

	async function handleRevokeOtherSessions() {
		if (mutationInProgress || !hasOtherSessions) return;

		setMutationInProgress("other-sessions");
		setMutationError(null);

		try {
			await revokeOtherSessions();

			setIsConfirmingOtherSessions(false);
		} catch (error) {
			setMutationError(error);
		} finally {
			setMutationInProgress(null);
		}
	}

	if (isLoadingSessions && sessions.length === 0) {
		return (
			<>
				<MetaDataInsert title="Active sessions" />

				<Loader type="page" msg="Retrieving your active sessions..." />
			</>
		);
	}

	return (
		<>
			<MetaDataInsert title="Active sessions" />

			<Section>
				{/* Page heading */}

				<Heading level={3}>Active sessions</Heading>

				<Text className="mt-2 max-w-2xl">
					Review the devices currently signed in to your account. You
					can sign out individual devices or end all other sessions.
				</Text>

				{/* Session collection */}

				<div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
					<div>
						<Heading level={3}>Your devices</Heading>

						<Text className="mt-1">
							{sessions.length} active{" "}
							{sessions.length === 1 ? "session" : "sessions"}
						</Text>
					</div>

					<Button
						type="button"
						disabled={isLoadingSessions}
						onClick={loadSessions}
					>
						{isLoadingSessions
							? "Refreshing..."
							: "Refresh sessions"}
					</Button>
				</div>

				{sessions.length === 0 && !sessionsError ? (
					<EmptyState
						label="No active sessions found"
						description="There are currently no active sessions associated with your
				account."
					/>
				) : (
					<div className="space-y-4">
						{sessions.map((session) => {
							const isConfirming =
								confirmingSessionId === session.id;

							const isRevoking =
								mutationInProgress === session.id;

							return (
								<Section
									key={session.id}
									className="rounded-xl border border-border bg-card text-card-foreground p-5 shadow-card sm:p-6"
								>
									{/* Device heading */}

									<div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
										<div className="min-w-0">
											<div className="flex flex-wrap items-center gap-2">
												<Heading level={3}>
													{getDeviceName(session)}
												</Heading>

												{session.current && (
													<span className="rounded-md bg-sage px-3 py-2 text-xs font-semibold text-secondary-foreground">
														<p>This device</p>
													</span>
												)}
											</div>

											{session.browser && (
												<Text className="mt-1">
													Browser: {session.browser}
												</Text>
											)}

											{session.operatingSystem && (
												<Text>
													Operating system:{" "}
													{session.operatingSystem}
												</Text>
											)}
										</div>
									</div>

									{/* Session details */}

									<div className="mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
										{session.ipAddress && (
											<div>
												<Text
													className="font-semibold uppercase tracking-wide"
													size="text-xs"
												>
													IP address
												</Text>

												<Text className="mt-1 break-all">
													{session.ipAddress}
												</Text>
											</div>
										)}

										<div>
											<Text
												className="font-semibold uppercase tracking-wide"
												size="text-xs"
											>
												Last activity
											</Text>

											<Text className="mt-1">
												{formatDate(
													session.lastActivityAt,
												)}
											</Text>
										</div>

										<div>
											<Text
												className="font-semibold uppercase tracking-wide"
												size="text-xs"
											>
												Session created
											</Text>

											<Text className="mt-1">
												{formatDate(session.createdAt)}
											</Text>
										</div>

										<div>
											<Text
												className="font-semibold uppercase tracking-wide"
												size="text-xs"
											>
												Session expires
											</Text>

											<Text className="mt-1">
												{formatDate(session.expiresAt)}
											</Text>
										</div>
									</div>

									{/* Individual revocation */}

									{!session.current && (
										<div className="mt-5 border-t border-border pt-4">
											{!isConfirming ? (
												<Button
													type="button"
													variant="secondary"
													disabled={Boolean(
														mutationInProgress,
													)}
													onClick={() => {
														setMutationError(null);
														setConfirmingSessionId(
															session.id,
														);
													}}
												>
													Revoke session
												</Button>
											) : (
												<div className="space-y-3">
													<Text className="font-semibold">
														Sign out this device?
													</Text>

													<Text>
														This will end this
														session. The device will
														need to sign in again to
														access your account.
													</Text>

													<div className="flex flex-wrap gap-3">
														<Button
															type="button"
															variant="secondary"
															disabled={Boolean(
																mutationInProgress,
															)}
															onClick={() =>
																setConfirmingSessionId(
																	null,
																)
															}
														>
															Cancel
														</Button>

														<Button
															type="button"
															disabled={Boolean(
																mutationInProgress,
															)}
															onClick={() =>
																handleRevokeSession(
																	session.id,
																)
															}
														>
															{isRevoking
																? "Revoking..."
																: "Confirm revocation"}
														</Button>
													</div>
												</div>
											)}
										</div>
									)}
								</Section>
							);
						})}
					</div>
				)}

				{/* Revoke all other sessions */}

				{hasOtherSessions && (
					<Section className="mt-8 rounded-xl border border-border bg-card text-card-foreground p-5 sm:p-6">
						<Heading level={2}>Sign out other devices</Heading>

						<Text className="mt-2">
							This will revoke all active sessions except the
							device you are currently using.
						</Text>

						{!isConfirmingOtherSessions ? (
							<Button
								type="button"
								variant="secondary"
								className="mt-4"
								disabled={Boolean(mutationInProgress)}
								onClick={() => {
									setMutationError(null);
									setIsConfirmingOtherSessions(true);
								}}
							>
								Revoke other sessions
							</Button>
						) : (
							<div className="mt-4 space-y-3">
								<Text className="font-semibold">
									Are you sure you want to continue?
								</Text>

								<Text>
									{otherSessions.length} other{" "}
									{otherSessions.length === 1
										? "session"
										: "sessions"}{" "}
									will be signed out. Your current session
									will remain active.
								</Text>

								<div className="flex flex-wrap gap-3">
									<Button
										type="button"
										variant="secondary"
										disabled={Boolean(mutationInProgress)}
										onClick={() =>
											setIsConfirmingOtherSessions(false)
										}
									>
										Cancel
									</Button>

									<Button
										type="button"
										disabled={Boolean(mutationInProgress)}
										onClick={handleRevokeOtherSessions}
									>
										{mutationInProgress === "other-sessions"
											? "Revoking..."
											: "Confirm revocation"}
									</Button>
								</div>
							</div>
						)}
					</Section>
				)}
			</Section>
		</>
	);
}
