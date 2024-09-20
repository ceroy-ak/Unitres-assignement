import { z } from "zod";

const loginBodySchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters long" }),
});

type LoginRequestBody = z.infer<typeof loginBodySchema>;

export { loginBodySchema, LoginRequestBody };
