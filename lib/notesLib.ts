import { Note } from "@/types/note";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

const KEY = "NOTES";

export async function getNotes(): Promise<Note[]> {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveNotes(notes: Note[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(notes));
}

export async function addNote(note: Note) {
  const notes = await getNotes();
  notes.push({ ...note, id: uuid.v4() });
  await saveNotes(notes);
}

export async function updateNote(id: string, note: Partial<Note>) {
  const notes = await getNotes();
  const index = notes.findIndex((n) => n.id === id);
  if (index < 0) return;

  notes[index] = { ...notes[index], ...note };
  await saveNotes(notes);
}

export async function deleteNote(id: string) {
  const notes = await getNotes();
  const filtered = notes.filter((n) => n.id !== id);
  await saveNotes(filtered);
}
