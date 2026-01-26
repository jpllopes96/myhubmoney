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

/* =========================
   CORS
========================= */

const allowedOrigins = [
  "https://gestor.jplabs.com.br",
  "https://myhubmoney-front-production.up.railway.app",

  // local
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  "http://localhost:3333",
  "http://127.0.0.1:3333",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, origin);
      }

      console.error("❌ CORS bloqueado para:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

/* =========================
   Middlewares
========================= */

app.use(express.json());

/* =========================
   Routes
========================= */

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
