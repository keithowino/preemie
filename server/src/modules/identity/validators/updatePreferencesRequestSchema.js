import { z } from "zod";
import { THEME_STATUS_VALUES } from "../../../app/index.js";

const updatePreferencesRequestSchema = z
	.object({
		appearance: z
			.object({
				theme: z.enum(THEME_STATUS_VALUES),
			})
			.strict(),
	})
	.strict();

export default updatePreferencesRequestSchema;
