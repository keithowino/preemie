import { z } from "zod";
import { PRESENCE_STATUS_VALUES } from "../../../app/index.js";

const updatePresenceRequestSchema = z
	.object({
		status: z.enum(PRESENCE_STATUS_VALUES),
	})
	.strict();

export default updatePresenceRequestSchema;
