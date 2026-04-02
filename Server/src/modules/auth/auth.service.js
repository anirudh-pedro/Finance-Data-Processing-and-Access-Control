const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../config/prisma");
const env = require("../../config/env");
const { createAppError } = require("../../utils/appError");

const VALID_ROLES = ["ADMIN", "ANALYST", "VIEWER"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeRegisterInput(payload) {
  return {
    name: (payload.name || "").trim(),
    email: (payload.email || "").trim().toLowerCase(),
    password: payload.password || "",
    role: payload.role ? String(payload.role).trim().toUpperCase() : "VIEWER",
  };
}

function validateRegisterInput(data) {
  if (!data.name || !data.email || !data.password) {
    throw createAppError(400, "name, email, and password are required", "VALIDATION_ERROR");
  }

  if (!EMAIL_REGEX.test(data.email)) {
    throw createAppError(400, "Invalid email format", "VALIDATION_ERROR");
  }

  if (!VALID_ROLES.includes(data.role)) {
    throw createAppError(
      400,
      "Invalid role. Allowed roles: ADMIN, ANALYST, VIEWER",
      "VALIDATION_ERROR"
    );
  }
}

async function registerUser(payload) {
  const data = sanitizeRegisterInput(payload);
  validateRegisterInput(data);

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw createAppError(400, "User already exists with this email", "USER_ALREADY_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return user;
}

async function loginUser(payload) {
  const email = (payload.email || "").trim().toLowerCase();
  const password = payload.password || "";

  if (!email || !password) {
    throw createAppError(400, "email and password are required", "VALIDATION_ERROR");
  }

  if (!EMAIL_REGEX.test(email)) {
    throw createAppError(400, "Invalid email format", "VALIDATION_ERROR");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw createAppError(401, "Invalid credentials", "INVALID_CREDENTIALS");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw createAppError(401, "Invalid credentials", "INVALID_CREDENTIALS");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    },
  };
}

module.exports = {
  registerUser,
  loginUser,
};
