import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.js";
import categoriesRoutes from "./routes/categories.js";
import transactionsRoutes from "./routes/transactions.js";
import employeesRoutes from "./routes/employees.js";
import adminRoutes from "./routes/admin.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/admin", adminRoutes);

app.listen(3333, () => {
  console.log("🔥 Backend rodando em http://localhost:3333");
});
