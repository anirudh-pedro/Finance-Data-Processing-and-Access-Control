const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const requestLogger = require("./middleware/requestLogger.middleware");
const errorMiddleware = require("./middleware/error.middleware");
const { createAppError } = require("./utils/appError");

dotenv.config();

const env = require("./config/env");
const prisma = require("./config/prisma");
const authRoutes = require("./modules/auth/auth.routes");
const financeRoutes = require("./modules/finance/finance.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");

const app = express();
const PORT = env.PORT;

app.use(
  cors({
    origin: env.CORS_ORIGIN || true,
  })
);
app.use(express.json());
app.use(requestLogger);
app.use("/auth", authRoutes);
app.use("/records", financeRoutes);
app.use("/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    data: "API Running",
  });
});

app.get("/test-db", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      errorCode: "DATABASE_CONNECTION_FAILED",
    });
  }
});

app.use((req, res, next) => {
  next(createAppError(404, "Route not found", "ROUTE_NOT_FOUND"));
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
