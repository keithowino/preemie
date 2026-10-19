import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
// Note: On Typescript, Google AI Studio syntax: API_KEY is handled via process.env.API_KEY directly as per guidelines.

const generateInventionIdeas = async (objectDescription, base64Image) => {
	// setLoading(true)

	// On Typescript, Google AI Studio syntax: Always initialize GoogleGenAI with a fresh instance inside the service function using the direct process.env.API_KEY.

	// It was const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
	// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
	const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

	// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

	/*
    
    Adding

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });  // Or your desired model
const response = await model.generateContent({ contents: [{ parts }] });  // Adjust as needed
    
    */

	const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

	const prompt = `Act as a world-class industrial designer and engineer. Given this starting object or device: "${objectDescription}", analyze it and generate 3 distinct and creative innovation ideas: 1. A 'Repurposing' idea (turning it into something else). 2. An 'Improvement' idea (enhancing its current design/efficiency). 3. A 'Novel/Undiscovered  Invention' (using parts of it to build a completely new gadget). Return the results in valid JSON. Make ideas feasible but exciting for all ages.`;

	const parts = [{ text: prompt }];

	if (base64Image) {
		parts.push({
			inlineData: {
				mimeType: "image/jpeg",
				data: base64Image,
			},
		});
	}

	// It was const result = await model.generateContent(prompt)
	// const response = await genAI.models.generateContent({
	//     model: "gemini-3-pro-preview",
	//     contents: { parts },
	//     config: {
	//         responseMimeType: "application/json",
	//         responseSchema: {
	//             type: Type.ARRAY,
	//             items: {
	//                 type: Type.OBJECT,
	//                 properties: {
	//                     title: { type: Type.STRING },
	//                     category: { type: Type.STRING },
	//                     shortDescription: { type: Type.STRING },
	//                     fullDescription: { type: Type.STRING },
	//                     noveltyScore: { type: Type.NUMBER },
	//                     feasibilityScore: { type: Type.NUMBER },
	//                     materials: { type: Type.ARRAY, items: { type: Type.STRING } },
	//                     scientificPrinciples: { type: Type.ARRAY, items: { type: Type.STRING } },
	//                     steps: {
	//                         type: Type.ARRAY,
	//                         items: {
	//                             type: Type.OBJECT,
	//                             properties: {
	//                                 title: { type: Type.STRING },
	//                                 description: { type: Type.STRING }
	//                             }
	//                         }
	//                     }
	//                 },
	//                 required: ["title", "category", "shortDescription", "fullDescription", "noveltyScore", "feasibilityScore", "materials", "steps"]
	//             }
	//         }
	//     }
	// });

	const response = await model.generateContent({
		// contents: [{ parts }],
		contents: [{ role: "user", parts: parts }],
		generationConfig: {
			responseMimeType: "application/json",
			responseSchema: {
				type: SchemaType.ARRAY,
				items: {
					type: SchemaType.OBJECT,
					properties: {
						title: { type: SchemaType.STRING },
						category: { type: SchemaType.STRING },
						shortDescription: { type: SchemaType.STRING },
						fullDescription: { type: SchemaType.STRING },
						noveltyScore: { type: SchemaType.NUMBER },
						feasibilityScore: { type: SchemaType.NUMBER },
						materials: {
							type: SchemaType.ARRAY,
							items: { type: SchemaType.STRING },
						},
						scientificPrinciples: {
							type: SchemaType.ARRAY,
							items: { type: SchemaType.STRING },
						},
						steps: {
							type: SchemaType.ARRAY,
							items: {
								type: SchemaType.OBJECT,
								properties: {
									title: { type: SchemaType.STRING },
									description: { type: SchemaType.STRING },
								},
							},
						},
					},
					required: [
						"title",
						"category",
						"shortDescription",
						"fullDescription",
						"noveltyScore",
						"feasibilityScore",
						"materials",
						"steps",
					],
				},
			},
		},
	});

	// // Save to Supabase
	// const { error } = await supabase
	//     .from('projects')
	//     .insert({
	//         user_id: session.user.id,
	//         input_description: description,
	//         generated_ideas: generatedIdeas,
	//     })

	// response.candidates[0].content.parts[0].text

	try {
		// Extract text output using the .text property as per guidelines.
		// const text = response.text || "[]";

		// const text = response.candidates[0].content.parts[0].text;
		// return JSON.parse(text);

		// Extract the text (standard structure)
		const generatedText =
			response.response.candidates?.[0]?.content?.parts?.[0]?.text ||
			"[]";
		const ideas = JSON.parse(generatedText);
		return ideas;
	} catch (error) {
		console.error("Failed to parse Gemini response:", error);
		alert("Error generating ideas: " + error.message);
		return [];
	}

	// finally {
	//     setLoading(false)
	// }
};

/*

For Image Generation / Multimodal Output
Your second function tries to generate images, but Gemini text models don't output images directly in generateContent. If you're aiming for photorealistic concept images:

Use gemini-2.5-flash (or -pro) with a prompt that describes the image → but it will return text (you'd then need a separate image gen API like Imagen via Vertex AI or another service).
There are specialized preview models like gemini-2.5-flash-image for image-related tasks, but they may not directly generate images in the response. Check the latest docs.
If you need actual image generation, consider integrating Google's Imagen (via Vertex AI) or a third-party like Stability AI, as Gemini's core generateContent is primarily for text/multimodal input, not image output.


Bonus: How to Dynamically List Available Models (Recommended for Debugging)
Add this helper function to your service file and call it once (e.g., in console) to see exactly what models your API key can access right now:

async function listAvailableModels() {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${import.meta.env.VITE_GEMINI_API_KEY}`
  );
  const data = await response.json();
  console.log("Available models:", data.models?.map(m => m.name.replace("models/", "")) || data);
}

*/
const generateConceptImage = async (idea) => {
	// On Typescript, Google AI Studio syntax: Always initialize GoogleGenAI with a fresh instance inside the service function using the direct process.env.API_KEY.

	// It was const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
	// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
	const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

	const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

	const prompt = `Photorealistic concept art of a ${idea.title}. Description: ${idea.fullDescription}. Style: High-tech industrial prototype, clean laboratory lighting, shallow depth of field, focused on materials like ${idea.materials.join(", ")}.`;

	// gemini-2.5-flash
	// const response = await genAI.models.generateContent({
	//     // model: 'gemini-2.5-flash-image',
	//     model: 'gemini-2.5-flash',
	//     contents: {
	//         parts: [{ text: prompt }],
	//     },
	//     config: {
	//         imageConfig: {
	//             aspectRatio: "16:9",
	//         }
	//     },
	// });

	const response = await model.generateContent({
		contents: [{ role: "user", parts: parts }],
		generationConfig: {
			imageConfig: {
				aspectRatio: "16:9",
			},
		},
	});

	// const generatedText = response.response.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

	// Iterating through all parts to find the image part, as it might not be the first one.
	for (const part of response.candidates?.[0]?.content?.parts || []) {
		if (part.inlineData) {
			return `data:image/png;base64,${part.inlineData.data}`;
		}
	}
	return undefined;
};

export default {
	generateInventionIdeas,
	generateConceptImage,
};
