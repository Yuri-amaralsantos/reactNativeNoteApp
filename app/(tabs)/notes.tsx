import { deleteNote, getNotes } from "@/lib/notes";
import { Link, router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NotesScreen() {
  const [notes, setNotes] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const data = await getNotes();
        setNotes(data);
      };
      load();
    }, [])
  );

  function openOptions(index: number) {
    Alert.alert("Opções", "O que deseja fazer?", [
      {
        text: "Editar",
        onPress: () =>
          router.push({ pathname: "/note/[id]", params: { id: index } }),
      },
      {
        text: "Excluir",
        onPress: async () => {
          await deleteNote(index);
          const updated = await getNotes();
          setNotes(updated);
        },
        style: "destructive",
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  }

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

      <FlatList
        data={notes}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            {/* Texto abre a nota */}
            <Link
              href={{
                pathname: "/note/[id]",
                params: { id: index.toString() },
              }}
              asChild
            >
              <TouchableOpacity style={{ flex: 1 }}>
                <Text style={styles.noteText}>{item}</Text>
              </TouchableOpacity>
            </Link>

            {/* Três pontos */}
            <TouchableOpacity
              onPress={() => openOptions(index)}
              style={styles.menuBtn}
            >
              <Text style={{ fontSize: 20 }}>⋮</Text>
            </TouchableOpacity>
          </View>
        )}
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

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#d6d3d3ff",
    borderRadius: 12,
    marginBottom: 12,
  },

  noteText: {
    fontSize: 16,
  },

  menuBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
