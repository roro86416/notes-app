import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router/router";
import "./assets/sidebar.css";
// import "./styles/global.css";
import App from "./App.vue";

createApp(App).use(createPinia()).use(router).mount("#app");
