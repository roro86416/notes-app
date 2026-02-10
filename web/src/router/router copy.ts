//靜態匯入
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import NotesList from "../pages/NotesList.vue";

import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "../stores/auth";

const routes = [
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },
  { path: "/", name: "notes", component: NotesList, meta: { auth: true } },
  {
    path: "/edit/:id",
    name: "note-edit",
    component: () => import("../pages/NoteEdit.vue"),
    meta: { auth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../pages/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const auth = useAuth();
  if (!auth.user && localStorage.getItem("token")) {
    await auth.me();
  }
  if (to.meta.auth && !auth.user) {
    return { name: "login" };
  }
});

export default router;
