import { Note } from "@/types/note";
import { Entypo } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  note: Note;
  onOptionsPress: (note: Note) => void;
};

export function NoteCard({ note, onOptionsPress }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          {note.type === "text" && (
            <Text style={styles.noteText} numberOfLines={2}>
              {note.content}
            </Text>
          )}

          {note.type === "task" && (
            <>
              <Text style={styles.noteTitle}>{note.title}</Text>
              <Text style={styles.subInfo}>
                {note.subtasks?.filter((s) => s?.done).length ?? 0} /{" "}
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

        {/* Botão de opções */}
        <TouchableOpacity onPress={() => onOptionsPress(note)}>
          <Entypo name="dots-three-vertical" size={20} />
        </TouchableOpacity>
      </View>
    </View>
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
