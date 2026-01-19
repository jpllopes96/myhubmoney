import express from "express";
import cors from "cors";
import "dotenv/config";
import { prisma } from "./lib/prisma.js";
import authRoutes from "./routes/auth.js";
import categoriesRoutes from "./routes/categories.js";
import transactionsRoutes from "./routes/transactions.js";
import employeesRoutes from "./routes/employees.js";
import adminRoutes from "./routes/admin.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/admin", adminRoutes);
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/debug/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ db: "connected" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ db: "error" });
  }
});
const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🔥 Backend rodando na porta ${PORT}`);
});
