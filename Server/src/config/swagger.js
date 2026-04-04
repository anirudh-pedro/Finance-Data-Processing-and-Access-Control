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
    servers: [],
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

function buildSwaggerSpec(currentOrigin) {
  const spec = JSON.parse(JSON.stringify(swaggerSpec));
  const servers = [
    {
      url: "/",
      description: "Current environment (relative)",
    },
  ];

  if (currentOrigin) {
    servers.push({
      url: currentOrigin,
      description: "Current environment",
    });
  }

  const defaults = [
    {
      url: "http://localhost:5000",
      description: "Local development",
    },
    {
      url: "https://finance-data-processing-and-access-fmor.onrender.com",
      description: "Production (Render)",
    },
  ];

  for (const server of defaults) {
    const alreadyExists = servers.some((item) => item.url === server.url);
    if (!alreadyExists) {
      servers.push(server);
    }
  }

  spec.servers = servers;
  return spec;
}

module.exports = {
  swaggerSpec,
  buildSwaggerSpec,
};
