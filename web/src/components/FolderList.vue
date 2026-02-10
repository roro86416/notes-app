<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
type Folder = { id: number; name: string };

defineProps<{
  folders: Folder[];
  activeFolderId: number | null;
}>();

const emit = defineEmits<{
  (e: "select-folder", id: number | null): void;
  (e: "create-folder"): void;
  (e: "rename-folder", id: number): void;
  (e: "delete-folder", id: number): void;
}>();

const openFor = ref<number | null>(null);
function onDoc(e: MouseEvent) {
  const el = e.target as HTMLElement;
  if (!el.closest("[data-folder-menu]") && !el.closest("[data-folder-trigger]"))
    openFor.value = null;
}
onMounted(() => document.addEventListener("click", onDoc));
onBeforeUnmount(() => document.removeEventListener("click", onDoc));
</script>

<template>
  <div class="folders">
    <div class="row head">
      <span class="label">專案資料夾</span>
      <button class="icon" title="新增資料夾" @click="emit('create-folder')">
        ＋
      </button>
    </div>

    <ul class="list">
      <li v-for="f in folders" :key="f.id" class="folder-item">
        <button
          class="row"
          :class="{ active: activeFolderId === f.id }"
          @click="emit('select-folder', f.id)"
        >
          <span class="ic">🗂️</span>
          <span class="name">{{ f.name }}</span>
        </button>

        <button
          class="more"
          data-folder-trigger
          @click.stop="openFor = openFor === f.id ? null : f.id"
          title="更多"
        >
          ⋯
        </button>

        <div v-if="openFor === f.id" class="dropdown" data-folder-menu>
          <button @click="emit('rename-folder', f.id)">重新命名</button>
          <button class="danger" @click="emit('delete-folder', f.id)">
            刪除
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
