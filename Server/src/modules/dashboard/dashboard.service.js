const prisma = require("../../config/prisma");
const { createAppError } = require("../../utils/appError");

function parseDateOrThrow(value, fieldName) {
  const parsed = new Date(value);

  if (!value || Number.isNaN(parsed.getTime())) {
    throw createAppError(400, `${fieldName} must be a valid datetime`, "VALIDATION_ERROR");
  }

  return parsed;
}

function buildWhereFromQuery(query, user) {
  const where = {};

  if (query.startDate || query.endDate) {
    where.date = {};

    if (query.startDate) {
      where.date.gte = parseDateOrThrow(query.startDate, "startDate");
    }

    if (query.endDate) {
      where.date.lte = parseDateOrThrow(query.endDate, "endDate");
    }

    if (where.date.gte && where.date.lte && where.date.gte > where.date.lte) {
      throw createAppError(400, "startDate cannot be greater than endDate", "VALIDATION_ERROR");
    }
  }

  if (user.role !== "ADMIN") {
    where.userId = user.userId;
  }

  return where;
}

function monthKeyFromDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

async function getSummary(query, user) {
  const baseWhere = buildWhereFromQuery(query, user);

  const [income, expense] = await Promise.all([
    prisma.record.aggregate({
      _sum: { amount: true },
      where: { ...baseWhere, type: "income" },
    }),
    prisma.record.aggregate({
      _sum: { amount: true },
      where: { ...baseWhere, type: "expense" },
    }),
  ]);

  const totalIncome = income._sum.amount || 0;
  const totalExpense = expense._sum.amount || 0;

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
  };
}

async function getCategorySummary(query, user) {
  const where = buildWhereFromQuery(query, user);

  const grouped = await prisma.record.groupBy({
    by: ["category", "type"],
    where,
    _sum: {
      amount: true,
    },
    orderBy: {
      category: "asc",
    },
  });

  const categoryMap = new Map();

  for (const item of grouped) {
    if (!categoryMap.has(item.category)) {
      categoryMap.set(item.category, {
        category: item.category,
        income: 0,
        expense: 0,
        total: 0,
      });
    }

    const bucket = categoryMap.get(item.category);
    const amount = item._sum.amount || 0;

    if (item.type === "income") {
      bucket.income += amount;
    } else {
      bucket.expense += amount;
    }

    bucket.total += amount;
  }

  return Array.from(categoryMap.values());
}

async function getMonthlyTrends(query, user) {
  const where = buildWhereFromQuery(query, user);

  const groupedByDate = await prisma.record.groupBy({
    by: ["date", "type"],
    where,
    _sum: {
      amount: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  const monthMap = new Map();

  for (const item of groupedByDate) {
    const month = monthKeyFromDate(item.date);

    if (!monthMap.has(month)) {
      monthMap.set(month, {
        month,
        totalIncome: 0,
        totalExpense: 0,
      });
    }

    const bucket = monthMap.get(month);
    const amount = item._sum.amount || 0;

    if (item.type === "income") {
      bucket.totalIncome += amount;
    } else {
      bucket.totalExpense += amount;
    }
  }

  return Array.from(monthMap.values()).sort((a, b) => a.month.localeCompare(b.month));
}

async function getRecentActivity(query, user) {
  const where = buildWhereFromQuery(query, user);
  const limitRaw = Number.parseInt(query.limit, 10);
  const limit = Number.isInteger(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 10) : 5;

  const records = await prisma.record.findMany({
    where,
    orderBy: {
      date: "desc",
    },
    take: limit,
  });

  return records;
}

module.exports = {
  getSummary,
  getCategorySummary,
  getMonthlyTrends,
  getRecentActivity,
};
