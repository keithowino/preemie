import dotenv from "dotenv";
import { z } from "zod";

// import emailSchema from "../../shared/validation/email.schema.js";

dotenv.config({
	path: `.env.${process.env.NODE_ENV || "development"}`,
});

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),

	/**
	 * Environment variables arrive as strings hence the `z.coerce.number()`.
	 */
	PORT: z.coerce.number().int().positive().default(5000),

	REQUEST_BODY_LIMIT: z
		.string()
		.trim()
		.min(1, "REQUEST_BODY_LIMIT cannot be empty.")
		.default("64kb"),

	IDEATION_GENERATION_RATE_LIMIT_MAX: z.coerce
		.number()
		.int()
		.positive()
		.default(5),

	IDEATION_GENERATION_RATE_LIMIT_WINDOW_MS: z.coerce
		.number()
		.int()
		.positive()
		.default(900000),

	IDEATION_RETRIEVAL_RATE_LIMIT_MAX: z.coerce
		.number()
		.int()
		.positive()
		.default(60),

	IDEATION_RETRIEVAL_RATE_LIMIT_WINDOW_MS: z.coerce
		.number()
		.int()
		.positive()
		.default(900000),

	MONGODB_URI: z.string().min(1, "MONGODB_URI is required."),

	GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required."),

	GEMINI_MODEL: z.string().trim().min(1, "GEMINI_MODEL cannot be empty."),

	CLIENT_URL: z.url().default("http://localhost:3000"),

	CLOUDINARY_CLOUD_NAME: z
		.string()
		.min(1, "CLOUDINARY_CLOUD_NAME is required."),

	CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required."),

	CLOUDINARY_API_SECRET: z
		.string()
		.min(1, "CLOUDINARY_API_SECRET is required."),

	JWT_ACCESS_SECRET: z
		.string()
		.min(32, "JWT_ACCESS_SECRET must be at least 32 characters."),

	JWT_REFRESH_SECRET: z
		.string()
		.min(32, "JWT_REFRESH_SECRET must be at least 32 characters."),

	// // JWT_ACCESS_EXPIRES: z.string().default("15m"),
	JWT_ACCESS_EXPIRES: z.string().default("1d"),

	JWT_REFRESH_EXPIRES: z.string().default("7d"),

	JWT_ISSUER: z.string().default("preemie-three"),

	JWT_AUDIENCE: z.string().default("preemie-three-client"),

	// RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required."),

	// CONTACT_NOTIFICATION_EMAIL: emailSchema,

	// RESEND_FROM_EMAIL: z.string().min(1, "RESEND_FROM_EMAIL is required."),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.error("❌ Invalid server environment configuration:");

	for (const issue of parsedEnv.error.issues) {
		console.error(`   - ${issue.path.join(".")}: ${issue.message}`);
	}

	process.exit(1);
}

export const env = {
	nodeEnv: parsedEnv.data.NODE_ENV,
	port: parsedEnv.data.PORT,
	requestBodyLimit: parsedEnv.data.REQUEST_BODY_LIMIT,
	mongoUri: parsedEnv.data.MONGODB_URI,
	clientUrl: parsedEnv.data.CLIENT_URL,

	cloudinary: {
		cloudName: parsedEnv.data.CLOUDINARY_CLOUD_NAME,
		apiKey: parsedEnv.data.CLOUDINARY_API_KEY,
		apiSecret: parsedEnv.data.CLOUDINARY_API_SECRET,
	},

	jwt: {
		accessSecret: parsedEnv.data.JWT_ACCESS_SECRET,
		refreshSecret: parsedEnv.data.JWT_REFRESH_SECRET,
		accessExpires: parsedEnv.data.JWT_ACCESS_EXPIRES,
		refreshExpires: parsedEnv.data.JWT_REFRESH_EXPIRES,
		issuer: parsedEnv.data.JWT_ISSUER,
		audience: parsedEnv.data.JWT_AUDIENCE,
	},

	gemini: {
		apiKey: parsedEnv.data.GEMINI_API_KEY,
		model: parsedEnv.data.GEMINI_MODEL,
	},

	// email: {
	// 	resendApiKey: parsedEnv.data.RESEND_API_KEY,
	// 	contactNotificationEmail: parsedEnv.data.CONTACT_NOTIFICATION_EMAIL,
	// 	resendFromEmail: parsedEnv.data.RESEND_FROM_EMAIL,
	// },

	ideationRateLimits: {
		generation: {
			max: parsedEnv.data.IDEATION_GENERATION_RATE_LIMIT_MAX,
			windowMs: parsedEnv.data.IDEATION_GENERATION_RATE_LIMIT_WINDOW_MS,
		},
		retrieval: {
			max: parsedEnv.data.IDEATION_RETRIEVAL_RATE_LIMIT_MAX,
			windowMs: parsedEnv.data.IDEATION_RETRIEVAL_RATE_LIMIT_WINDOW_MS,
		},
	},
};
