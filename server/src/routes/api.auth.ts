import { Router } from "express";
import { prisma } from "../prisma.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../env.js";
import type { JwtUser } from "../interfaces/auth.js";

export const apiAuth = Router();

apiAuth.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const exists = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (exists) return res.status(409).json({ error: "此信箱已註冊過" });

    const hash = await bcrypt.hash(data.password, env.BCRYPT_ROUNDS);
    const user = await prisma.user.create({
      data: { email: data.email, password: hash, name: data.name },
      select: { id: true, email: true, name: true },
    });

    const payload: JwtUser = user;
    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
    res.json({ user: payload, token });
  } catch (err) {
    next(err);
  }
});

apiAuth.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return res.status(401).json({ error: "錯誤的電子信箱" });

    const ok = await bcrypt.compare(data.password, user.password);
    if (!ok) return res.status(401).json({ error: "密碼錯誤" });

    const payload: JwtUser = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
    res.json({ user: payload, token });
  } catch (err) {
    next(err);
  }
});

apiAuth.get("/me", (req, res) => {
  // @ts-ignore
  return res.json({ user: req.user || null });
});
