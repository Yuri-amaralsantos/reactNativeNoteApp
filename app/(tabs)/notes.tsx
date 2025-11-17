import { OptionsModal } from "@/app/(tabs)/components/OptionsModal";
import { useNotes } from "@/stores/useNote";
import { Note } from "@/types/note";
import { Link, router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NoteCard } from "./components/noteCard";

export default function NotesScreen() {
  const { notes = [], load, deleteNote } = useNotes();
  const [selected, setSelected] = useState<Note | null>(null);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const safeNotes = notes.filter(
    (n) => n && typeof n === "object" && "id" in n
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={styles.title}>Minhas Notas</Text>

      <Link href="/note/new" asChild>
        <TouchableOpacity style={styles.addBtn}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Adicionar Nota +
          </Text>
        </TouchableOpacity>
      </Link>

      {safeNotes.length === 0 && (
        <Text style={{ opacity: 0.5, marginTop: 20 }}>
          Nenhuma nota encontrada.
        </Text>
      )}

      <FlatList
        data={safeNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard note={item} onOptionsPress={(note) => setSelected(note)} />
        )}
      />

      <OptionsModal
        visible={!!selected}
        onClose={() => setSelected(null)}
        onEdit={() => {
          if (!selected) return;
          router.push({
            pathname: "/note/[id]",
            params: { id: selected.id },
          });
          setSelected(null);
        }}
        onDelete={async () => {
          if (!selected) return;
          await deleteNote(selected.id);
          setSelected(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 30,
  },

  addBtn: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
});
