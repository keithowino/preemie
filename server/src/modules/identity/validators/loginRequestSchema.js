import { z } from "zod";
import { emailSchema, passwordSchema } from "../../../app/index.js";

const loginRequestSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

export default loginRequestSchema;
