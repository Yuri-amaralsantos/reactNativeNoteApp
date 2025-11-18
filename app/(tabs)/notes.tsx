import { useNotes } from "@/stores/useNote";
import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NoteCard } from "./components/noteCard";

export default function NotesScreen() {
  const { notes = [], load } = useNotes();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "text" | "task" | "event"
  >("all");

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

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

  const displayedNotes = notes
    .filter(
      (n) =>
        n &&
        typeof n === "object" &&
        "id" in n &&
        (filterType === "all" || n.type === filterType) &&
        n.title.toLowerCase().includes(search.toLowerCase())
    )
    .map((note) => ({
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

      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar por título..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filterRow}>
        {["all", "text", "task", "event"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterBtn,
              filterType === type && styles.filterBtnActive,
            ]}
            onPress={() => setFilterType(type as any)}
          >
            <Text
              style={[
                styles.filterText,
                filterType === type && { color: "white", fontWeight: "bold" },
              ]}
            >
              {type === "all"
                ? "Todos"
                : type === "text"
                ? "Texto"
                : type === "task"
                ? "Tarefas"
                : "Eventos"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {displayedNotes.length === 0 && (
        <Text style={{ opacity: 0.5, marginTop: 20 }}>
          Nenhuma nota encontrada.
        </Text>
      )}

      <FlatList
        data={displayedNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteCard note={item} />}
        contentContainerStyle={{ paddingBottom: 40 }}
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
    backgroundColor: "#4F46E5",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
  },

  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4F46E5",
  },

  filterBtnActive: {
    backgroundColor: "#4F46E5",
  },

  filterText: {
    color: "#4F46E5",
  },
});
