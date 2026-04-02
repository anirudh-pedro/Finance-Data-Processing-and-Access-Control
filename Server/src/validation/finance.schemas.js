const { z } = require("zod");

const recordTypeEnum = z.enum(["income", "expense"]);

const createRecordSchema = z.object({
  amount: z.coerce.number().gt(0, "amount must be a number greater than 0"),
  type: recordTypeEnum,
  category: z.string().trim().min(1, "category is required"),
  date: z.coerce.date({ error: "date must be a valid datetime" }),
  notes: z.string().trim().optional().nullable(),
});

const updateRecordSchema = z
  .object({
    amount: z.coerce.number().gt(0, "amount must be a number greater than 0").optional(),
    type: recordTypeEnum.optional(),
    category: z.string().trim().min(1, "category is required").optional(),
    date: z.coerce.date({ error: "date must be a valid datetime" }).optional(),
    notes: z.string().trim().optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No valid fields provided for update",
  });

const recordIdParamSchema = z.object({
  id: z.coerce.number().int().positive("Invalid record id"),
});

module.exports = {
  createRecordSchema,
  updateRecordSchema,
  recordIdParamSchema,
};
