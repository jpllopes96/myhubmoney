import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
export async function createUser(req, res) {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ error: "Email, senha e nome são obrigatórios" });
    }
    const exists = await prisma.user.findUnique({
        where: { email },
    });
    if (exists) {
        return res.status(400).json({ error: "Usuário já existe" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });
    return res.status(201).json({ id: user.id });
}
