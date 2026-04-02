const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finance Dashboard API",
      version: "1.0.0",
      description:
        "Role-based backend for managing users, financial records, and analytics using Node.js, Express, Prisma, and PostgreSQL.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development",
      },
      {
        url: "https://finance-data-processing-and-access-fmor.onrender.com",
        description: "Production (Render)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/modules/**/*.routes.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
