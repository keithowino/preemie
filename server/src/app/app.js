import express from "express";
import cookieParser from "cookie-parser";
import { cors, env } from "./config/index.js";
import routes from "./routes/api.js";
import { errorHandler, notFound } from "./lib/index.js";
import { requestMetadata } from "./lib/index.js";

const app = express();

/**
 * #### Express Setup
 * - Middleware order must be as follows
 * - Any other order leads to subtle bugs
 * #### The Thought is:
 * - (cors)Cross-origin validation
 * - (JSON Parser)Parse request body
 * - (Cookie Parser)Parse refresh/access cookies
 * - (Request Metadata)Build request context - (IP, User-Agent, etc.)
 * - (Routes)Controllers, Services, Audit Logging,..
 * - 404 Handler
 * - Global Error Handler(The global error handler must be last.)
 */

app.use(cors);

// app.use(express.json());
/**
 * The JSON parser will now reject oversized payloads
 * before the routes execute.
 */
app.use(
	express.json({
		limit: env.requestBodyLimit,
	}),
);

app.use(cookieParser());

app.use(requestMetadata);

app.use("/api/v1", routes);

app.use(notFound);

/**
 * app.use(uploadErrorHandler);
 */

app.use(errorHandler);

export default app;
