<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useNotes, type Note } from "../stores/notes";

const props = defineProps<{ note: Note }>();
const notes = useNotes();

const title = ref(props.note.title || "");
const content = ref(props.note.content || "");
const saving = ref(false);

watch(
  () => props.note.id,
  () => {
    title.value = props.note.title || "";
    content.value = (props.note as any).content || "";
  }
);

// 500ms 停止輸入就自動儲存（去抖）
let t: number | undefined;
const queueSave = () => {
  window.clearTimeout(t);
  t = window.setTimeout(() => void save(), 500);
};
watch(title, queueSave);
watch(content, queueSave);

const save = async () => {
  saving.value = true;
  try {
    await notes.update(props.note.id, {
      title: title.value,
      content: content.value,
    });
  } finally {
    saving.value = false;
  }
};

// Ctrl/Cmd + S 手動儲存
const onKey = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
    e.preventDefault();
    void save();
  }
};
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));
</script>

<template>
  <div class="editor">
    <div class="toolbar">
      <input class="title" v-model="title" placeholder="標題" />
      <span class="status" v-if="saving">Saving…</span>
      <button class="btn" @click="save" title="儲存">儲存</button>
    </div>

    <textarea
      class="area"
      v-model="content"
      placeholder="開始輸入…"
      spellcheck="false"
    />
  </div>
</template>

<style scoped>
.editor {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 56px 1fr;
}
.toolbar {
  display: flex;
  gap: 8px;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 8px 12px;
}
.title {
  flex: 1;
  min-width: 240px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  font-size: 18px;
}
.status {
  font-size: 12px;
  color: #777;
}
.btn {
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #111;
  color: #fff;
  padding: 8px 12px;
}
.area {
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  padding: 16px;
  font: 16px/1.6 system-ui, -apple-system, Segoe UI, Roboto;
  resize: none;
}
</style>
