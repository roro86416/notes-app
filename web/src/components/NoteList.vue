<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
type Note = {
  id: number;
  title: string;
  updatedAt: string;
  folderId?: number | null;
};
type Folder = { id: number; name: string };

const props = defineProps<{
  notes: Note[]; // 要顯示的那一組（未分類或某資料夾）
  folders: Folder[]; // 供「移至資料夾」下拉使用
  activeNoteId: number | null;
  title?: string; // 區塊標題，如「未分類」
  allowUncategorize?: boolean; // 是否顯示「取消分類」
}>();

const emit = defineEmits<{
  (e: "select-note", id: number): void;
  (e: "rename-note", id: number): void;
  (e: "delete-note", id: number): void;
  (e: "move-note", p: { id: number; folderId: number | null }): void;
}>();

const openFor = ref<number | null>(null);
function onDoc(e: MouseEvent) {
  const el = e.target as HTMLElement;
  if (!el.closest("[data-note-menu]") && !el.closest("[data-note-trigger]"))
    openFor.value = null;
}
onMounted(() => document.addEventListener("click", onDoc));
onBeforeUnmount(() => document.removeEventListener("click", onDoc));
</script>

<template>
  <div class="notes">
    <div v-if="title" class="uncat-head">{{ title }}</div>

    <ul class="note-list">
      <li v-for="n in notes" :key="n.id">
        <div
          class="note-row"
          :class="{ active: activeNoteId === n.id }"
          @click="emit('select-note', n.id)"
        >
          <div class="title">{{ n.title || "未命名" }}</div>
          <div class="time">{{ new Date(n.updatedAt).toLocaleString() }}</div>

          <div class="more-wrap">
            <button
              class="more"
              data-note-trigger
              @click.stop="openFor = openFor === n.id ? null : n.id"
              title="更多"
            >
              ⋯
            </button>

            <div v-if="openFor === n.id" class="dropdown" data-note-menu>
              <button @click="emit('rename-note', n.id)">重新命名</button>
              <div class="sub">
                <span class="sub-label">移至資料夾</span>
                <button
                  v-for="f in folders"
                  :key="f.id"
                  @click="emit('move-note', { id: n.id, folderId: f.id })"
                >
                  {{ f.name }}
                </button>
                <button
                  v-if="allowUncategorize"
                  @click="emit('move-note', { id: n.id, folderId: null })"
                >
                  取消分類
                </button>
              </div>
              <button class="danger" @click="emit('delete-note', n.id)">
                刪除
              </button>
            </div>
          </div>
        </div>
      </li>

      <li v-if="notes.length === 0" class="empty">沒有筆記</li>
    </ul>
  </div>
</template>
