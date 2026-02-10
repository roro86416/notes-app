<script setup lang="ts">
import { ref, computed } from "vue";
import SearchBar from "./SearchBar.vue";
import FolderList from "./FolderList.vue";
import NoteList from "./NoteList.vue";
import UserMenu from "./UserMenu.vue";



type Note = {
  id: number;
  title: string;
  updatedAt: string;
  folderId?: number | null;
};
type Folder = { id: number; name: string };

const props = defineProps<{
  notes: Note[];
  folders: Folder[];
  activeNoteId: number | null;
  userEmail?: string;
}>();

const emit = defineEmits<{
  (e: "create-note"): void;
  (e: "select-note", id: number): void;
  (e: "rename-note", id: number): void;
  (e: "delete-note", id: number): void;
  (e: "move-note", p: { id: number; folderId: number | null }): void;
  (e: "create-folder"): void;
  (e: "select-folder", id: number | null): void;
  (e: "rename-folder", id: number): void;
  (e: "delete-folder", id: number): void;
  (e: "logout"): void;
}>();

const q = ref("");
const activeFolderId = ref<number | null>(null);

const chooseFolder = (id: number | null) => {
  activeFolderId.value = id;
  emit("select-folder", id);
};

const folderNotes = computed(() => {
  const s = q.value.trim().toLowerCase();
  return props.notes.filter(
    (n) =>
      activeFolderId.value !== null &&
      (n.folderId ?? null) === activeFolderId.value &&
      (n.title || "").toLowerCase().includes(s)
  );
});

const uncategorizedNotes = computed(() => {
  const s = q.value.trim().toLowerCase();
  return props.notes.filter(
    (n) =>
      (n.folderId ?? null) === null && (n.title || "").toLowerCase().includes(s)
  );
});

const activeFolderName = computed(
  () =>
    props.folders.find((f) => f.id === activeFolderId.value)?.name || "此資料夾"
);

</script>

<template>
  <aside class="sb">
    <!-- 上：搜尋 + 新增 -->
    <SearchBar v-model="q" @create-note="$emit('create-note')" />

    <!-- 中段：可捲動 -->
    <div class="scroll">
      <!-- 1) 資料夾清單 -->
      <FolderList
        :folders="folders"
        :active-folder-id="activeFolderId"
        @select-folder="chooseFolder"
        @create-folder="$emit('create-folder')"
        @rename-folder="$emit('rename-folder', $event)"
        @delete-folder="$emit('delete-folder', $event)"
      />

      <!-- 2) 當前資料夾的筆記（顯示在資料夾清單「底下」） -->
      <NoteList
        v-if="activeFolderId !== null"
        :title="activeFolderName"
        :notes="folderNotes"
        :folders="folders"
        :active-note-id="activeNoteId"
        :allow-uncategorize="true"
        @select-note="$emit('select-note', $event)"
        @rename-note="$emit('rename-note', $event)"
        @delete-note="$emit('delete-note', $event)"
        @move-note="$emit('move-note', $event)"
      />

      <!-- 分隔線 -->
      <div class="sep"></div>

      <!-- 3) 未分類筆記（在當前資料夾筆記「下面」） -->
      <NoteList
        title="未分類"
        :notes="uncategorizedNotes"
        :folders="folders"
        :active-note-id="activeNoteId"
        :allow-uncategorize="false"
        @select-note="$emit('select-note', $event)"
        @rename-note="$emit('rename-note', $event)"
        @delete-note="$emit('delete-note', $event)"
        @move-note="$emit('move-note', $event)"
      />
    </div>

    <!-- 底：會員（若你用固定置底樣式，請保留相對應 CSS） -->
    <UserMenu
      :email="userEmail || 'user@example.com'"
      @logout="$emit('logout')"
    />
  </aside>
</template>
<style scoped>
/* 容器與可捲動區 */
.sb {
  display: flex;
  flex-direction: column;
  width: 320px;
  height: 100vh;
  border-right: 1px solid #e5e7eb;
  background: #fafafa;
}
.scroll {
  flex: 1;
  overflow: auto; /* 讓中段可捲動 */
  padding: 4px 0 72px; /* 預留底部空間給固定的 UserMenu */
}

/* 區塊分隔線 */
.sep {
  height: 1px;
  background: #e5e7eb;
  margin: 8px 0;
}
</style>
