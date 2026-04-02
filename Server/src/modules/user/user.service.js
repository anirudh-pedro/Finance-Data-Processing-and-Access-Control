const prisma = require("../../config/prisma");
const { createAppError } = require("../../utils/appError");

const userPublicSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
};

function getPagination(query) {
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

async function getUsers(query) {
  const pagination = getPagination(query);

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: userPublicSelect,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / pagination.limit)),
    },
  };
}

async function updateUser(userId, payload, currentUser) {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  if (!existingUser) {
    throw createAppError(404, "User not found", "USER_NOT_FOUND");
  }

  const data = {};

  if (payload.role !== undefined) {
    data.role = payload.role;
  }

  if (payload.status !== undefined) {
    data.status = payload.status;
  }

  if (Object.keys(data).length === 0) {
    throw createAppError(400, "No valid fields provided for update", "VALIDATION_ERROR");
  }

  if (currentUser.userId === userId) {
    if (data.role && data.role !== "ADMIN") {
      throw createAppError(
        400,
        "You cannot change your own role from ADMIN",
        "SELF_ROLE_UPDATE_FORBIDDEN"
      );
    }

    if (data.status === false) {
      throw createAppError(
        400,
        "You cannot deactivate your own account",
        "SELF_STATUS_UPDATE_FORBIDDEN"
      );
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
    select: userPublicSelect,
  });

  return updatedUser;
}

async function getUserById(userId, currentUser) {
  if (currentUser.role !== "ADMIN" && currentUser.userId !== userId) {
    throw createAppError(403, "Forbidden: insufficient role permissions", "FORBIDDEN");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userPublicSelect,
  });

  if (!user) {
    throw createAppError(404, "User not found", "USER_NOT_FOUND");
  }

  return user;
}

module.exports = {
  getUsers,
  updateUser,
  getUserById,
};
