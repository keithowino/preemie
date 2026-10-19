import app from "./app.js";
import { env } from "./config/index.js";
import { database } from "./bootstrap/index.js";
/**
 * recommended for use only during development.
 * import dns from "dns";
 * dns.setServers(["8.8.8.8", "1.1.1.1"]);
 */

let server;

/**
 * Start the application.
 */
async function start() {
	try {
		await database.connectDatabase();

		server = app.listen(env.port, () => {
			console.log(
				`🚀 Server listening on port ${env.port} (${env.nodeEnv})`,
			);
		});
	} catch (error) {
		console.error("❌ Server startup failed:", error);

		await database.disconnectDatabase();

		process.exit(1);
	}
}

/**
 * Gracefully shut down the application.
 */
async function shutdown(signal) {
	console.log(`\n🛑 ${signal} received. Shutting down...`);

	try {
		if (server) {
			await new Promise((resolve, reject) => {
				server.close((error) => {
					if (error) {
						reject(error);
						return;
					}

					resolve();
				});
			});

			console.log("✅ HTTP server closed");
		}

		await database.disconnectDatabase();

		console.log("👋 Shutdown complete");

		process.exit(0);
	} catch (error) {
		console.error("❌ Error during shutdown:", error);

		process.exit(1);
	}
}
/**
 * #### process.on(event, callback):
 * - Tells Node.js to listen for a specific event on the running process.
 *
 * #### SIGINT:
 * This signal is sent when you press Ctrl+C in the terminal. It’s a way to interrupt the process.
 *
 * SIGTERM:
 * This signal is sent when the system or another process asks your app to terminate
 */
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start();
