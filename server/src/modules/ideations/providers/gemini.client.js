import { GoogleGenAI } from "@google/genai";
import { env } from "../../../app/config/index.js"; // recommended: to avoid circular dependency.
import { createGeminiProvider } from "./gemini.provider.js";

const client = new GoogleGenAI({
	apiKey: env.gemini.apiKey,
	httpOptions: {
		timeout: 45_000,
	},
});

export const geminiProvider = createGeminiProvider({
	client,
	model: env.gemini.model,
});
