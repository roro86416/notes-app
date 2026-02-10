<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { useAuth } from "./stores/auth";
const auth = useAuth();
</script>

<template>
  <main style="padding: 0">
    <!-- 由各頁自行掌控全寬全高 -->
    <RouterView />
  </main>
</template>
