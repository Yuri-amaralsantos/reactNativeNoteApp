import { useNotes } from "@/stores/useNote";
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
