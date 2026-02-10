import axios from "axios";
import router from "../router/router";

export const api = axios.create({
  baseURL: "http://192.168.65.123:3000/api/",
});
//設定請求攔截器，在每次發送請求前執行
api.interceptors.request.use((c) => {
  const t = localStorage.getItem("token");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      router.push("/login");
    }
    return Promise.reject(err);
  }
);
