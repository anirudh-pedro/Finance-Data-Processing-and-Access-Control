const prisma = require("../../config/prisma");
const { createAppError } = require("../../utils/appError");

const ALLOWED_TYPES = ["income", "expense"];

function parsePositiveNumber(value, fieldName) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw createAppError(400, `${fieldName} must be a number greater than 0`, "VALIDATION_ERROR");
  }

  return parsed;
}

function parseType(value) {
  const type = String(value || "").trim().toLowerCase();

  if (!ALLOWED_TYPES.includes(type)) {
    throw createAppError(400, "type must be either income or expense", "VALIDATION_ERROR");
  }

  return type;
}

function parseCategory(value) {
  const category = String(value || "").trim();

  if (!category) {
    throw createAppError(400, "category is required", "VALIDATION_ERROR");
  }

  return category;
}

function parseDateOrThrow(value, fieldName = "date") {
  const date = new Date(value);

  if (!value || Number.isNaN(date.getTime())) {
    throw createAppError(400, `${fieldName} must be a valid datetime`, "VALIDATION_ERROR");
  }

  return date;
}

function parsePagination(query) {
  const page = Number.parseInt(query.page, 10) || 1;
  const limit = Number.parseInt(query.limit, 10) || 10;

  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 ? Math.min(limit, 100) : 10;

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
  };
}

function buildRecordWhereClause(query, user) {
  const where = {};

  if (query.type) {
    where.type = parseType(query.type);
  }

  if (query.category) {
    where.category = String(query.category).trim();
  }

  if (query.startDate || query.endDate) {
    where.date = {};

    if (query.startDate) {
      where.date.gte = parseDateOrThrow(query.startDate, "startDate");
    }

    if (query.endDate) {
      where.date.lte = parseDateOrThrow(query.endDate, "endDate");
    }
  }

  if (user.role !== "ADMIN") {
    where.userId = user.userId;
  }

  return where;
}

async function createRecord(payload, user) {
  const amount = parsePositiveNumber(payload.amount, "amount");
  const type = parseType(payload.type);
  const category = parseCategory(payload.category);
  const date = parseDateOrThrow(payload.date);
  const notes = payload.notes ? String(payload.notes).trim() : null;

  const createdRecord = await prisma.record.create({
    data: {
      amount,
      type,
      category,
      date,
      notes,
      userId: user.userId,
    },
  });

  return createdRecord;
}

async function getRecords(query, user) {
  const pagination = parsePagination(query);
  const where = buildRecordWhereClause(query, user);

  const [records, total] = await Promise.all([
    prisma.record.findMany({
      where,
      orderBy: { date: "desc" },
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.record.count({ where }),
  ]);

  return {
    records,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / pagination.limit)),
    },
  };
}

async function updateRecord(idParam, payload) {
  const id = Number.parseInt(idParam, 10);

  if (!Number.isInteger(id) || id <= 0) {
    throw createAppError(400, "Invalid record id", "VALIDATION_ERROR");
  }

  const existingRecord = await prisma.record.findUnique({ where: { id } });

  if (!existingRecord) {
    throw createAppError(404, "Record not found", "RECORD_NOT_FOUND");
  }

  const data = {};

  if (payload.amount !== undefined) {
    data.amount = parsePositiveNumber(payload.amount, "amount");
  }

  if (payload.type !== undefined) {
    data.type = parseType(payload.type);
  }

  if (payload.category !== undefined) {
    data.category = parseCategory(payload.category);
  }

  if (payload.date !== undefined) {
    data.date = parseDateOrThrow(payload.date);
  }

  if (payload.notes !== undefined) {
    data.notes = payload.notes === null ? null : String(payload.notes).trim();
  }

  if (Object.keys(data).length === 0) {
    throw createAppError(400, "No valid fields provided for update", "VALIDATION_ERROR");
  }

  const updatedRecord = await prisma.record.update({
    where: { id },
    data,
  });

  return updatedRecord;
}

async function deleteRecord(idParam) {
  const id = Number.parseInt(idParam, 10);

  if (!Number.isInteger(id) || id <= 0) {
    throw createAppError(400, "Invalid record id", "VALIDATION_ERROR");
  }

  const existingRecord = await prisma.record.findUnique({ where: { id } });

  if (!existingRecord) {
    throw createAppError(404, "Record not found", "RECORD_NOT_FOUND");
  }

  await prisma.record.delete({ where: { id } });
}

module.exports = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
};
