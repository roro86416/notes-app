import { z } from "zod";

export const noteCreateSchema = z.object({
  title: z.string().min(1, "請輸入標題").max(200),
  content: z.string().default(""),
});

export const noteUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
  isPinned: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});
