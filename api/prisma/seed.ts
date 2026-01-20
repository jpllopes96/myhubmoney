import { PrismaClient, CategoryType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("12345678", 10);

  const user = await prisma.user.upsert({
    where: { email: "divisafarma@gmail.com" },
    update: {},
    create: {
      email: "divisafarma@gmail.com",
      password: passwordHash,
      name: "Divisa Farma",
    },
  });

  console.log("Usuário criado:", user.email);

  const categories = [
    {
      name: "Alimentação",
      type: CategoryType.expense,
      icon: "utensils",
      color: "#ef4444",
    },
    {
      name: "Transporte",
      type: CategoryType.expense,
      icon: "car",
      color: "#f97316",
    },
    {
      name: "Moradia",
      type: CategoryType.expense,
      icon: "home",
      color: "#eab308",
    },
    {
      name: "Saúde",
      type: CategoryType.expense,
      icon: "heart",
      color: "#22c55e",
    },
    {
      name: "Educação",
      type: CategoryType.expense,
      icon: "book",
      color: "#3b82f6",
    },
    {
      name: "Lazer",
      type: CategoryType.expense,
      icon: "gamepad",
      color: "#8b5cf6",
    },
    {
      name: "Outros",
      type: CategoryType.expense,
      icon: "circle",
      color: "#6b7280",
    },

    {
      name: "Salário",
      type: CategoryType.income,
      icon: "wallet",
      color: "#10b981",
    },
    {
      name: "Freelance",
      type: CategoryType.income,
      icon: "laptop",
      color: "#14b8a6",
    },
    {
      name: "Investimentos",
      type: CategoryType.income,
      icon: "trending-up",
      color: "#06b6d4",
    },
    {
      name: "Vendas",
      type: CategoryType.income,
      icon: "shopping-bag",
      color: "#0ea5e9",
    },
    {
      name: "Outros",
      type: CategoryType.income,
      icon: "circle",
      color: "#6b7280",
    },
  ];

  for (const category of categories) {
    await prisma.category.create({
      data: {
        userId: user.id,
        ...category,
      },
    });
  }

  console.log("Categorias padrão criadas");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
