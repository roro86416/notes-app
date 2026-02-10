import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireJwt } from "../middlewares/jwt.js";
import { noteCreateSchema, noteUpdateSchema } from "../schemas/note.schema.js";
import type { AuthedRequest } from "../middlewares/jwt.js";

export const apiNotes = Router();
apiNotes.use(requireJwt);

apiNotes.get("/", async (req: AuthedRequest, res) => {
  const notes = await prisma.note.findMany({
    where: { userId: req.user!.id },
    orderBy: [{ updatedAt: "desc" }],
  });
  res.json({ notes });
});

apiNotes.post("/", async (req: AuthedRequest, res, next) => {
  try {
    const data = noteCreateSchema.parse(req.body);
    const note = await prisma.note.create({
      data: { userId: req.user!.id, title: data.title, content: data.content },
    });
    res.status(201).json({ note });
  } catch (err) {
    next(err);
  }
});

apiNotes.get("/:id", async (req: AuthedRequest, res) => {
  const id = Number(req.params.id);
  const note = await prisma.note.findFirst({
    where: { id, userId: req.user!.id },
  });
  if (!note) return res.status(404).json({ error: "NOT_FOUND" });
  res.json({ note });
});

apiNotes.put("/:id", async (req: AuthedRequest, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = noteUpdateSchema.parse(req.body);
    const note = await prisma.note.update({ where: { id }, data });
    res.json({ note });
  } catch (err) {
    next(err);
  }
});

apiNotes.delete("/:id", async (req: AuthedRequest, res) => {
  const id = Number(req.params.id);
  await prisma.note.delete({ where: { id } });
  res.status(204).end();
});
