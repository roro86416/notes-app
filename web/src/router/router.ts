// src/router/router.ts
import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "../stores/auth";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Workspace from "../pages/Workspace.vue"; // 新頁，內含 Sidebar+Editor

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", name: "login", component: Login },
    { path: "/register", name: "register", component: Register },
    {
      path: "/",
      name: "workspace",
      component: Workspace,
      meta: { auth: true },
    },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuth();
  if (!auth.user && localStorage.getItem("token")) await auth.me();
  if (to.meta.auth && !auth.user) return { name: "login" };
  return true;
});

export default router;
