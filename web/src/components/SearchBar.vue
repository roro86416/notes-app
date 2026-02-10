<script setup lang="ts">
const modelValue = defineModel<string>({ default: "" });
const emit = defineEmits<{ (e: "create-note"): void }>();
</script>
<template>
  <div class="top">
    <button class="primary" @click="emit('create-note')">
      <span class="ic">＋</span>新增筆記
    </button>
    <div class="search">
      <span class="ic"></span>
      <input v-model="modelValue" placeholder="搜尋筆記" />
    </div>
  </div>
</template>
<style>
.top {
  padding: 12px;
  display: grid;
  gap: 8px;
  border-bottom: 1px solid #eee;
}
.primary {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: #111;
  color: #fff;
  width: 100%;
}
.search {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 8px 10px;
  background: #fff;
}
.search input {
  border: 0;
  outline: 0;
  width: 100%;
  background: transparent;
}
.ic {
  width: 18px;
  display: inline-grid;
  place-items: center;
}
</style>
