// web/src/stores/notes.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "../api/axios";

export type Note = {
  id: number;
  title: string;
  content: string;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  folderId?: number | null; //前端暫存
};

export const useNotes = defineStore("notes", () => {
  const list = ref<Note[]>([]);
  const loading = ref(false);

  const fetch = async () => {
    loading.value = true;
    try {
      const { data } = await api.get("/notes");
      list.value = data.notes as Note[];
    } finally {
      loading.value = false;
    }
  };

  const create = async (p: { title: string; content: string }) => {
    const { data } = await api.post("/notes", p);
    const note = data.note as Note;
    list.value.unshift(note);
    return { note };
  };

  const update = async (id: number, p: Partial<Note>) => {
    const { data } = await api.put(`/notes/${id}`, p);
    const i = list.value.findIndex((n) => n.id === id);
    if (i !== -1) list.value[i] = data.note as Note;
  };

  const remove = async (id: number) => {
    await api.delete(`/notes/${id}`);
    list.value = list.value.filter((n) => n.id !== id);
  };

  return { list, loading, fetch, create, update, remove };
});
