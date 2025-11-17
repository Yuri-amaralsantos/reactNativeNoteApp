import { getNotes, saveNotes } from "@/lib/notes";
import { Note } from "@/types/note";
import uuid from "react-native-uuid";
import { create } from "zustand";

type NotesState = {
  notes: Note[];

  load: () => Promise<void>;
  addTextNote: (text: string) => Promise<void>;
  addTaskNote: (title: string) => Promise<void>;
  addEventNote: (title: string, date: string) => Promise<void>;

  updateNote: (id: string, patch: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
};

export const useNotes = create<NotesState>((set, get) => ({
  notes: [],

  load: async () => {
    const data = await getNotes();
    set({ notes: data });
  },

  addTextNote: async (text: string) => {
    const newNote: Note = {
      id: uuid.v4() as string,
      type: "text",
      content: text,
    };

    const notes = [...get().notes, newNote];
    set({ notes });
    await saveNotes(notes);
  },

  addTaskNote: async (title: string) => {
    const newNote: Note = {
      id: uuid.v4() as string,
      type: "task",
      title,
      subtasks: [],
    };

    const notes = [...get().notes, newNote];
    set({ notes });
    await saveNotes(notes);
  },

  addEventNote: async (title: string, date: string) => {
    const newNote: Note = {
      id: uuid.v4() as string,
      type: "event",
      title,
      date,
    };

    const notes = [...get().notes, newNote];
    set({ notes });
    await saveNotes(notes);
  },

  updateNote: async (id: string, patch: Partial<Note>) => {
    const notes = get().notes.map((n: Note) =>
      n.id === id ? { ...n, ...patch } : n
    );

    set({ notes });
    await saveNotes(notes);
  },

  deleteNote: async (id: string) => {
    const notes = get().notes.filter((n: Note) => n.id !== id);

    set({ notes });
    await saveNotes(notes);
  },
}));
