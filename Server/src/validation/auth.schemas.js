const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  email: z.string().trim().email("Invalid email format"),
  password: z.string().min(1, "password is required"),
  role: z.enum(["ADMIN", "ANALYST", "VIEWER"]).optional().default("VIEWER"),
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  password: z.string().min(1, "password is required"),
});

module.exports = {
  registerSchema,
  loginSchema,
};
