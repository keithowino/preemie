/** requestMetadata v1.0.1 */

import UAParser from "ua-parser-js";

/**
 * #### Implement shared User-Agent parsing
 *
 * The current ua-parser-js latest release is 2.x and is AGPL-3.0-or-later. Its older 1.x line is MIT licensed. Since Preemie is a proprietary application, I would not introduce the current AGPL release without deliberately reviewing the licensing implications. The npm package listing confirms the distinction: v1.x is MIT, while v2.x is AGPL.
 *
 * For this stage requestMetadata v1.0.1, use the MIT 1.x line:
 */

/**
 * Builds request metadata used by security-sensitive workflows such as
 * session creation and session rotation.
 *
 * The Identity domain consumes this metadata but does not perform
 * User-Agent parsing itself.
 */

/**
 * #### The ipAddress value:
 * - When you deploy behind a reverse proxy (Vercel, Nginx, Render, Cloudflare, etc.), this captures the client's original IP rather than the proxy's address.
 */
export default function requestMetadata(req, res, next) {
	const userAgent = req.get("User-Agent") || null;

	const parser = new UAParser(userAgent || undefined);

	const browser = parser.getBrowser();
	const device = parser.getDevice();
	const operatingSystem = parser.getOS();

	const deviceName =
		device.vendor || device.model
			? [device.vendor, device.model].filter(Boolean).join(" ")
			: device.type || "Desktop";

	req.requestMetadata = {
		ipAddress:
			req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip,

		userAgent,

		deviceName,

		browser: browser.name
			? browser.version
				? `${browser.name} ${browser.version}`
				: browser.name
			: null,

		operatingSystem: operatingSystem.name
			? operatingSystem.version
				? `${operatingSystem.name} ${operatingSystem.version}`
				: operatingSystem.name
			: null,
	};

	next();
}
