import { z } from "zod";

const emailSchema = z
	.email("A valid email address is required.")
	.transform((email) => email.toLowerCase());

export default emailSchema;
