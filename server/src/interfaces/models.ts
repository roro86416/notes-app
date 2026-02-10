// src/models.ts
import type { Prisma, User, Note } from "@prisma/client";

/** 對外公開的使用者型別（去除敏感欄位） */
export type PublicUser = Pick<User, "id" | "email" | "name">;

/** 常用 select：User（對外） */
export const userSelect = {
  id: true,
  email: true,
  name: true,
} satisfies Prisma.UserSelect;

/** DB → DTO */
export function toPublicUser(
  u: User | Pick<User, "id" | "email" | "name">
): PublicUser {
  // 允許既有 select 結果或完整 User 皆可傳入
  return {
    id: u.id,
    email: u.email,
    name: (u as User).name ?? (u as any).name,
  };
}

/** 對外公開的筆記型別（不暴露 userId；可選附帶作者） */
export type NoteDTO = Omit<Note, "userId"> & { author?: PublicUser };

/** 常用 select：純筆記 */
export const noteSelectBasic = {
  id: true,
  title: true,
  content: true,
  isPinned: true,
  isArchived: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.NoteSelect;

/** 常用 select：筆記 + 作者（對外） */
export const noteSelectWithAuthor = {
  ...noteSelectBasic,
  user: { select: userSelect },
} satisfies Prisma.NoteSelect;

/** DB → DTO（純筆記） */
export function toNoteDTO(n: Note): NoteDTO {
  const { userId, ...rest } = n;
  return rest;
}

/** DB → DTO（含作者） */
export function toNoteWithAuthor(
  n: Prisma.NoteGetPayload<{ select: typeof noteSelectWithAuthor }>
): NoteDTO {
  const { user, ...rest } = n;
  return { ...rest, author: toPublicUser(user as any) };
}

/** 認證回應封裝（方便在 routes 統一回傳型別） */
export interface AuthTokenBundle {
  user: PublicUser;
  token: string;
}
