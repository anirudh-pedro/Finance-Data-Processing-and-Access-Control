const { z } = require("zod");

const userIdParamSchema = z.object({
  id: z.coerce.number().int().positive("Invalid user id"),
});

const userListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

const userUpdateSchema = z
  .object({
    role: z.enum(["ADMIN", "ANALYST", "VIEWER"]).optional(),
    status: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No valid fields provided for update",
  });

module.exports = {
  userIdParamSchema,
  userListQuerySchema,
  userUpdateSchema,
};
