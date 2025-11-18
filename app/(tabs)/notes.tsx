import { useNotes } from "@/stores/useNote";
import { Note } from "@/types/note";
import { Link, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NoteCard } from "./components/noteCard";

export default function NotesScreen() {
  const { notes = [], load } = useNotes();

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const safeNotes: Note[] = notes.filter(
    (n) => n && typeof n === "object" && "id" in n
  );

  // Função para formatar datas
  function formatDateTime(iso?: string) {
    if (!iso) return "";
    const date = new Date(iso);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Formata data antes de passar para o NoteCard
  const formattedNotes = safeNotes.map((note) => ({
    ...note,
    date: note.date ? formatDateTime(note.date) : note.date,
  }));

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

      {formattedNotes.length === 0 && (
        <Text style={{ opacity: 0.5, marginTop: 20 }}>
          Nenhuma nota encontrada.
        </Text>
      )}

      <FlatList
        data={formattedNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteCard note={item} />}
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
