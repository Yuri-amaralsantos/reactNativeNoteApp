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
              <Text style={styles.noteText} numberOfLines={2}>
                {note.description}
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
    padding: 16,
    backgroundColor: "#d6d3d3ff",
    borderRadius: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteText: {
    fontSize: 16,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  subInfo: {
    fontSize: 14,
    opacity: 0.7,
  },
});
