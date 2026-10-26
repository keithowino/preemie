import { z } from "zod";

const refreshRequestSchema = z.object({
	refreshToken: z.string().min(1, "Refresh token is required."),
});

export default refreshRequestSchema;
