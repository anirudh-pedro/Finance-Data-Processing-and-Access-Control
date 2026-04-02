const { z } = require("zod");

const optionalDateSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  return value;
}, z.coerce.date({ error: "must be a valid datetime" }).optional());

const recordsQuerySchema = z
  .object({
    type: z.enum(["income", "expense"]).optional(),
    category: z.string().trim().optional(),
    startDate: optionalDateSchema,
    endDate: optionalDateSchema,
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  })
  .refine((data) => !(data.startDate && data.endDate) || data.startDate <= data.endDate, {
    message: "startDate cannot be greater than endDate",
  });

const dashboardDateFilterSchema = z
  .object({
    startDate: optionalDateSchema,
    endDate: optionalDateSchema,
  })
  .refine((data) => !(data.startDate && data.endDate) || data.startDate <= data.endDate, {
    message: "startDate cannot be greater than endDate",
  });

const dashboardRecentQuerySchema = z
  .object({
    startDate: optionalDateSchema,
    endDate: optionalDateSchema,
    limit: z.coerce.number().int().positive().max(10).default(5),
  })
  .refine((data) => !(data.startDate && data.endDate) || data.startDate <= data.endDate, {
    message: "startDate cannot be greater than endDate",
  });

module.exports = {
  recordsQuerySchema,
  dashboardDateFilterSchema,
  dashboardRecentQuerySchema,
};
