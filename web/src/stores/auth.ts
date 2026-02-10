// web/src/stores/auth.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "../api/axios";

type User = { id: number; email: string; name: string } | null;

export const useAuth = defineStore("auth", () => {
  const user = ref<User>(null);
  const loading = ref(false);

  const me = async () => {
    const { data } = await api.get("/auth/me");
    user.value = data.user;
  };

  const login = async (payload: { email: string; password: string }) => {
    loading.value = true;
    try {
      const { data } = await api.post("/auth/login", payload);
      localStorage.setItem("token", data.token);
      user.value = data.user;
    } finally {
      loading.value = false;
    }
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
  }) => {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("token", data.token);
    user.value = data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    user.value = null;
  };

  return { user, loading, me, login, register, logout };
});
