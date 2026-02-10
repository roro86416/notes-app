import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email({ message: "請輸入有效的電子郵件格式" }),
  password: z.string().min(1, "請輸入密碼"),
  name: z.string().min(1, "名稱請勿空白").max(100),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "請輸入有效的電子郵件格式" }),
  password: z.string().min(1, "請輸入密碼"),
});
