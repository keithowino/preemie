import rateLimit from "express-rate-limit";

import { env } from "../env.js";
import { error, ErrorCodes, HTTP_STATUS } from "../../lib/index.js";

/**
 * Creates a rate limiter for an ideation endpoint group.
 *
 * The default key generator uses the request IP address.
 * The default memory store is suitable for a single server instance.
 *
 * @param {{ max: number, windowMs: number }} limits
 * @returns {import("express-rate-limit").RateLimitRequestHandler}
 *
 * The in-memory counters are local to this server process.
 * If you later deploy multiple instances, we'll need a
 * shared store to enforce limits consistently across them.
 */
export function createIdeationRateLimiter({ max, windowMs }) {
	return rateLimit({
		windowMs,
		limit: max,
		standardHeaders: true /** Enables standard rate-limit response headers */,
		legacyHeaders: false /** Disables the older X-RateLimit-* headers */,

		handler(req, res) {
			return error(
				res,
				"Too many requests. Please try again later.",
				HTTP_STATUS.TOO_MANY_REQUESTS,
				ErrorCodes.TOO_MANY_REQUESTS,
			);
		},
	});
}

export const generationRateLimiter = createIdeationRateLimiter(
	env.ideationRateLimits.generation,
);

export const retrievalRateLimiter = createIdeationRateLimiter(
	env.ideationRateLimits.retrieval,
);
