import { Note } from "@/types/note";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  note: Note;
};

export function NoteCard({ note }: Props) {
  return (
    <Link href={`/note/${note.id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            {note.type === "text" && (
              <Text style={styles.noteTitle} numberOfLines={2}>
                {note.title}
              </Text>
            )}

            {note.type === "task" && (
              <>
                <Text style={styles.noteTitle}>{note.title}</Text>
                <Text style={styles.subInfo}>
                  {note.subtasks?.filter((s) => s.done).length ?? 0} /{" "}
                  {note.subtasks?.length ?? 0} completadas
                </Text>
              </>
            )}

            {note.type === "event" && (
              <>
                <Text style={styles.noteTitle}>{note.title}</Text>
                <Text style={styles.subInfo}>📅 {note.date}</Text>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
  },
  noteTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  subInfo: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
