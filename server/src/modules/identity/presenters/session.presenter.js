import { getId } from "../../../app/index.js";

class SessionPresenter {
	present(session, currentSessionId = null) {
		const sessionId = getId(session);

		return {
			id: sessionId,
			deviceName: session.deviceName ?? null,
			browser: session.browser ?? null,
			operatingSystem: session.operatingSystem ?? null,
			ipAddress: session.ipAddress ?? null,

			lastActivityAt: session.lastActivityAt,
			expiresAt: session.expiresAt,

			current: sessionId === String(currentSessionId),

			createdAt: session.createdAt,
		};
	}

	presentCollection(sessions, currentSessionId = null) {
		return sessions.map((session) =>
			this.present(session, currentSessionId),
		);
	}
}

export default new SessionPresenter();
