// src/schemas/folder.schema.ts
import { z } from "zod";

export const folderCreateSchema = z.object({
  name: z.string().trim().min(1).max(50),
});
export const folderUpdateSchema = z.object({
  name: z.string().trim().min(1).max(50),
});
export const moveNoteSchema = z.object({
  folderId: z.number().int().nullable(), // null = 取消分類
});
export type FolderCreateInput = z.infer<typeof folderCreateSchema>;
export type FolderUpdateInput = z.infer<typeof folderUpdateSchema>;
