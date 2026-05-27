import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = "password123";

async function main() {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  await prisma.review.deleteMany();
  await prisma.rental.deleteMany();
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: "Олександр Адміністратор",
      email: "admin@carrental.ua",
      password: passwordHash,
      role: Role.ADMIN,
    },
  });

  await prisma.user.createMany({
    data: [
      {
        name: "Марія Коваленко",
        email: "maria.kovalenko@example.com",
        password: passwordHash,
        role: Role.USER,
      },
      {
        name: "Іван Петренко",
        email: "ivan.petrenko@example.com",
        password: passwordHash,
        role: Role.USER,
      },
    ],
  });

  await prisma.car.createMany({
    data: [
      {
        brand: "Toyota",
        model: "Camry",
        year: 2022,
        pricePerDay: 45.0,
        isAvailable: true,
        imageName: "car1.jpg",
        description:
          "Комфортний седан бізнес-класу з економічним двигуном, автоматичною коробкою передач та системою безпеки Toyota Safety Sense.",
      },
      {
        brand: "Volkswagen",
        model: "Tiguan",
        year: 2021,
        pricePerDay: 55.0,
        isAvailable: true,
        imageName: "car2.jpg",
        description:
          "Практичний кросовер для міста та подорожей: просторий салон, повний привід 4Motion, парктроніки та мультимедійна система.",
      },
      {
        brand: "BMW",
        model: "320i",
        year: 2023,
        pricePerDay: 75.0,
        isAvailable: true,
        imageName: "car3.jpg",
        description:
          "Спортивний седан преміум-класу з турбодвигуном, шкіряним салоном, LED-оптикою та адаптивним круїз-контролем.",
      },
      {
        brand: "Hyundai",
        model: "Tucson",
        year: 2022,
        pricePerDay: 50.0,
        isAvailable: true,
        imageName: "car4.jpg",
        description:
          "Сучасний міський кросовер із великим багажником, камерою заднього виду та підтримкою Apple CarPlay / Android Auto.",
      },
      {
        brand: "Skoda",
        model: "Octavia",
        year: 2020,
        pricePerDay: 40.0,
        isAvailable: true,
        imageName: "car5.jpg",
        description:
          "Надійний універсал для щоденних поїздок: низька витрата палива, просторий багажник та зручна посадка для пасажирів.",
      },
    ],
  });

  console.log("Seed completed successfully.");
  console.log(`Admin: ${admin.email} (password: ${DEFAULT_PASSWORD})`);
  console.log("Users: maria.kovalenko@example.com, ivan.petrenko@example.com");
  console.log("Cars: 5 vehicles (car1.jpg – car5.jpg)");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
