import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "NOTES";

export async function getNotes(): Promise<string[]> {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveNotes(notes: string[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(notes));
}

export async function addNote(text: string) {
  const notes = await getNotes();
  notes.push(text);
  await saveNotes(notes);
}

export async function updateNote(id: number, text: string) {
  const notes = await getNotes();
  notes[id] = text;
  await saveNotes(notes);
}

export async function deleteNote(index: number) {
  const notes = await getNotes();
  notes.splice(index, 1);
  await saveNotes(notes);
}
