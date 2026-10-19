import mongoose from "mongoose";
import { env } from "../config/index.js";

/**
 * db.products.dropIndex("business_1_name_1");
 * db.products.getIndexes();
 *
 * #### States
 *
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
 */

export async function connectDatabase() {
	await mongoose.connect(env.mongoUri);

	console.log("✅ Connected to MongoDB");
}
export function isDatabaseConnected() {
	return mongoose.connection.readyState === 1;
}

export async function disconnectDatabase() {
	await mongoose.disconnect();

	console.log("🔌 Disconnected from MongoDB");
}
