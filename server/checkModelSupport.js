import { GoogleGenAI } from "@google/genai";
import { env } from "./src/app/config/index.js";

const client = new GoogleGenAI({
	apiKey: env.gemini.apiKey,
	httpOptions: { timeout: 20000 },
});

const checkSupport = async () => {
	const models = await client.models.list();
	let { page } = models;
	while (page.length > 0) {
		for (const model of page) {
			console.log(
				`- ${model.name} (${model.displayName}) | [Actions: ${model.supportedActions?.join(", ")}]`,
			);
		}
		page = models.hasNextPage() ? await models.nextPage() : [];
	}
};

checkSupport();
