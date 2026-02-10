<!-- src/pages/Workspace.vue -->
<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useNotes, type Note } from "../stores/notes";
import { useAuth } from "../stores/auth";
import NoteSidebar from "../components/NoteSidebar.vue";
import NoteEditor from "../components/NoteEditor.vue";

const notes = useNotes();
const auth = useAuth();

// 假資料夾狀態（之後再接後端）
type Folder = { id: number; name: string };
const folders = ref<Folder[]>([
  // 之後你可改成從 API 取回來
  // { id: 1, name: '專題二' },
  // { id: 2, name: '個人' },
]);

// 目前選取的筆記 ID 與資料夾篩選
const selectedId = ref<number | null>(null);
const activeFolderId = ref<number | null>(null); // null = 未分類

// 載入筆記列表並預設選第一筆
onMounted(async () => {
  await notes.fetch();
  if (notes.list.length) selectedId.value = notes.list[0].id;
});

// 目前選取的筆記資料
const selectedNote = computed<Note | null>(() => {
  const id = selectedId.value;
  if (!id) return null;
  return notes.list.find((n) => n.id === id) || null;
});

// 事件：建立新筆記
const onCreateNote = async () => {
  const { note } = (await notes.create({
    title: "未命名",
    content: "",
  })) as any;
  selectedId.value = note.id;
};

// 事件：選取筆記
const onSelectNote = (id: number) => {
  selectedId.value = id;
};

// 事件：重新命名筆記（暫用 prompt）
const onRenameNote = async (id: number) => {
  const target = notes.list.find((n) => n.id === id);
  if (!target) return;
  const name = window.prompt("重新命名", target.title || "");
  if (name == null) return;
  await notes.update(id, { title: name });
};

// 事件：刪除筆記（暫用 confirm）
const onDeleteNote = async (id: number) => {
  if (!window.confirm("確定刪除這則筆記？")) return;
  await notes.remove(id);
  // 若刪到目前選取那筆，改選其他
  if (selectedId.value === id) {
    selectedId.value = notes.list[0]?.id ?? null;
  }
};

// 事件：移動筆記到資料夾（暫存在前端屬性 folderId；你可改為呼叫 API）
const onMoveNote = async (payload: { id: number; folderId: number | null }) => {
  const { id, folderId } = payload;
  await notes.update(id, {
    /* 後端加欄位後改成 { folderId } */
  });
  // 先在前端同步屬性（若你的 Note 型別含 folderId）
  const n = notes.list.find((x) => x.id === id) as any;
  if (n) n.folderId = folderId;
};

// 事件：建立資料夾（暫用 prompt）
const onCreateFolder = () => {
  const name = window.prompt("新資料夾名稱", "");
  if (!name) return;
  const id = Date.now(); // 假 ID，之後換成後端回來的 id
  folders.value.push({ id, name });
};

// 事件：切換資料夾（供 Sidebar 呼叫）
const onSelectFolder = (id: number | null) => {
  activeFolderId.value = id;
  // 可選：切換資料夾時自動選第一筆
  const first = notes.list.find((n) => (n as any).folderId ?? null === id);
  selectedId.value = first?.id ?? null;
};

// 登出
const onLogout = () => {
  auth.logout();
  // 這裡可選擇 router.push('/login')，看你的路由守門策略
};

const onRenameFolder = (id: number) => {
  const f = folders.value.find((x) => x.id === id);
  if (!f) return;
  const name = window.prompt("重新命名資料夾", f.name);
  if (name && name.trim()) f.name = name.trim();
};

const onDeleteFolder = (id: number) => {
  const f = folders.value.find((x) => x.id === id);
  if (!f) return;
  if (
    !window.confirm(`確定刪除資料夾「${f.name}」？\n其中筆記將移至「未分類」。`)
  )
    return;

  // 1) 刪資料夾
  folders.value = folders.value.filter((x) => x.id !== id);

  // 2) 該資料夾底下的筆記 → 轉成未分類
  for (const n of notes.list as any[]) {
    if ((n.folderId ?? null) === id) n.folderId = null;
  }

  // 3) 若目前瀏覽的是被刪的資料夾，切回未分類
  if (activeFolderId.value === id) {
    activeFolderId.value = null;
    const first = notes.list.find((n) => (n as any).folderId ?? null === null);
    selectedId.value = first?.id ?? null;
  }
};
</script>

<template>
  <div class="workspace">
    <NoteSidebar
      :notes="notes.list"
      :folders="folders"
      :active-note-id="selectedId"
      @create-note="onCreateNote"
      @select-note="onSelectNote"
      @rename-note="onRenameNote"
      @delete-note="onDeleteNote"
      @move-note="onMoveNote"
      @create-folder="onCreateFolder"
      @select-folder="onSelectFolder"
      @rename-folder="onRenameFolder"
      @delete-folder="onDeleteFolder"
      @logout="onLogout"
    />

    <section class="editor-pane">
      <NoteEditor v-if="selectedNote" :note="selectedNote" />
      <div v-else class="empty">請從左側選擇或新增一則筆記</div>
    </section>
  </div>
</template>

<style scoped>
.workspace {
  display: grid;
  grid-template-columns: 320px 1fr; /* 左側固定 320px，右側滿版 */
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
.editor-pane {
  height: 100%;
  width: 100%;
  display: block; /* 由 NoteEditor 內部自己管理滿版 */
  background: #fff;
}
.empty {
  height: 100%;
  display: grid;
  place-items: center;
  color: #888;
}
</style>
