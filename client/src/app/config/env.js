import { z } from "zod";

const envSchema = z.object({
	MODE: z.enum(["development", "production", "test"]).default("development"),

	VITE_API_URL: z.url("VITE_API_URL must be a valid URL."),
});

const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
	console.error("Invalid client environment configuration:");

	for (const issue of parsedEnv.error.issues) {
		console.error(`- ${issue.path.join(".")}: ${issue.message}`);
	}

	throw new Error("Invalid client environment configuration.");
}

const env = Object.freeze({
	mode: parsedEnv.data.MODE,
	apiUrl: parsedEnv.data.VITE_API_URL.replace(/\/+$/, ""),
});

export default env;
