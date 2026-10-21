import { GoogleGenAI } from "@google/genai";
import { env } from "./src/app/config/index.js";

const client = new GoogleGenAI({
	apiKey: env.gemini.apiKey,
	httpOptions: { timeout: 20000 },
});

const startedAt = Date.now();

const testConnection = async () => {
	try {
		const response = await client.models.generateContent({
			model: env.gemini.model,
			contents: 'Return exactly this JSON: {"status":"ok"}',
			config: {
				responseMimeType: "application/json",
			},
		});

		console.log({
			outcome: "success",
			elapsedMs: Date.now() - startedAt,
			response: response.text,
		});
	} catch (error) {
		console.error({
			outcome: "failure",
			elapsedMs: Date.now() - startedAt,
			name: error?.name,
			message: error?.message,
			causeName: error?.cause?.name,
			causeMessage: error?.cause?.message,
			status: error?.status ?? error?.cause?.status,
		});
	}
};

testConnection();
