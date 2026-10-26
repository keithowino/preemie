import { z } from "zod";

const logoutRequestSchema = z.object({
	refreshToken: z.string().min(1),
});

export default logoutRequestSchema;
