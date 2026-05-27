import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Car Rental API",
      version: "1.0.0",
      description:
        "REST API для системи автоматизації прокату автомобілів (курсова робота)",
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: "Development server",
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
      schemas: {
        CarInput: {
          type: "object",
          required: [
            "brand",
            "model",
            "year",
            "pricePerDay",
            "imageName",
            "description",
          ],
          properties: {
            brand: { type: "string", example: "Toyota" },
            model: { type: "string", example: "Camry" },
            year: { type: "integer", example: 2022 },
            pricePerDay: { type: "number", example: 45 },
            isAvailable: { type: "boolean", example: true },
            imageName: { type: "string", example: "car1.jpg" },
            description: { type: "string" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["USER", "ADMIN"] },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
          },
        },
      },
    },
  },
  // Відносні шляхи — glob на Windows з абсолютним path не працює
  apis: ["./src/routes/*.ts", "./dist/routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
