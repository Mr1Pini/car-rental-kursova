import app from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
      console.log(`API root: http://localhost:${env.port}/`);
      console.log(`Swagger: http://localhost:${env.port}/api-docs`);
      console.log(`Health check: http://localhost:${env.port}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
