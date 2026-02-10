<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useAuth } from "../stores/auth";
import router from "../router/router";
const auth = useAuth();
const props = defineProps<{ email: string }>();
const emit = defineEmits<{ (e: "logout"): void }>();

const open = ref(false);
function onDoc(e: MouseEvent) {
  const el = e.target as HTMLElement;
  if (!el.closest("[data-user-trigger]") && !el.closest("[data-user-menu]"))
    open.value = false;
}
onMounted(() => document.addEventListener("click", onDoc));
onBeforeUnmount(() => document.removeEventListener("click", onDoc));
</script>

<template>
  <div class="account">
    <button class="acct-btn" data-user-trigger @click="open = !open">
      <span class="avatar">👤</span>
      <span class="name">{{ auth.user?.name }}</span>
      <span class="chev">▴</span>
    </button>

    <div v-if="open" class="acct-menu up" data-user-menu>
      <div class="email">{{ props.email }}</div>
      <button class="logout" @click="emit('logout')">登出</button>
    </div>
  </div>
</template>
<style scoped>
.account {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 310px;
  padding: 8px;
  background: #fafafa;
  border-top: 1px solid #e5e7eb;
  z-index: 30;
}
.scroll {
  overflow: auto;
  flex: 1;
  padding-bottom: 72px;
}
.sep {
  height: 1px;
  background: #e5e7eb;
  margin: 8px 0;
}
</style>
