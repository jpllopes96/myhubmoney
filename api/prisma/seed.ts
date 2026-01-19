import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });
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
      type: "expense",
      icon: "utensils",
      color: "#ef4444",
    },
    { name: "Transporte", type: "expense", icon: "car", color: "#f97316" },
    { name: "Moradia", type: "expense", icon: "home", color: "#eab308" },
    { name: "Saúde", type: "expense", icon: "heart", color: "#22c55e" },
    { name: "Educação", type: "expense", icon: "book", color: "#3b82f6" },
    { name: "Lazer", type: "expense", icon: "gamepad", color: "#8b5cf6" },
    { name: "Outros", type: "expense", icon: "circle", color: "#6b7280" },

    { name: "Salário", type: "income", icon: "wallet", color: "#10b981" },
    { name: "Freelance", type: "income", icon: "laptop", color: "#14b8a6" },
    {
      name: "Investimentos",
      type: "income",
      icon: "trending-up",
      color: "#06b6d4",
    },
    { name: "Vendas", type: "income", icon: "shopping-bag", color: "#0ea5e9" },
    { name: "Outros", type: "income", icon: "circle", color: "#6b7280" },
  ] as const;

  for (const category of categories) {
    await prisma.category.create({
      data: {
        userId: user.id,
        name: category.name,
        type: category.type,
        icon: category.icon,
        color: category.color,
      },
    });
  }

  console.log("Categorias padrão criadas");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
