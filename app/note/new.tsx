import { useNotes } from "@/stores/useNote";
import { router } from "expo-router";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function NewNote() {
  const { addTextNote, addTaskNote, addEventNote } = useNotes();

  const [type, setType] = useState<"text" | "task" | "event">("text");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [eventDate, setEventDate] = useState("");

  function addSubtaskField() {
    setSubtasks([...subtasks, ""]);
  }

  function updateSubtask(index: number, value: string) {
    const copy = [...subtasks];
    copy[index] = value;
    setSubtasks(copy);
  }

  function removeSubtask(index: number) {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  }

  async function save() {
    if (type === "text") {
      await addTextNote(title, description);
    }

    if (type === "task") {
      await addTaskNote(
        title,
        subtasks.map((s) => ({
          id: String(Date.now() + Math.random()),
          title: s,
          done: false,
        })),
        description
      );
    }

    if (type === "event") {
      await addEventNote(title, eventDate, description);
    }

    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Nota</Text>

      <TextInput
        style={styles.input}
        placeholder="Título..."
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.textArea}
        placeholder="Descrição..."
        value={description}
        onChangeText={setDescription}
        multiline
        textAlignVertical="top"
      />

      <View style={styles.typeSelector}>
        {["text", "task", "event"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.typeBtn, type === t && styles.typeBtnActive]}
            onPress={() => setType(t as any)}
          >
            <Text
              style={{
                color: type === t ? "white" : "#555",
                fontWeight: "600",
              }}
            >
              {t === "text" && "Texto"}
              {t === "task" && "Tarefa"}
              {t === "event" && "Evento"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {type === "task" && (
        <>
          <Text style={styles.subtitle}>Subtarefas</Text>

          {subtasks.map((sub, index) => (
            <View key={index} style={styles.subtaskRow}>
              <TextInput
                style={styles.subtaskInput}
                placeholder={`Subtarefa ${index + 1}`}
                value={sub}
                onChangeText={(v) => updateSubtask(index, v)}
              />
              <TouchableOpacity onPress={() => removeSubtask(index)}>
                <Text style={styles.deleteBtn}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            onPress={addSubtaskField}
            style={styles.addSubtaskBtn}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              + Adicionar subtarefa
            </Text>
          </TouchableOpacity>
        </>
      )}

      {type === "event" && (
        <TextInput
          style={styles.input}
          placeholder="Data (ex: 2025-01-10)"
          value={eventDate}
          onChangeText={setEventDate}
        />
      )}

      <Button title="Salvar" onPress={save} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#f7f7f7",
  },

  title: {
    fontSize: 24,
    marginBottom: 15,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },

  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    height: 200,
  },

  typeSelector: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },

  typeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#e5e5e5",
    borderRadius: 8,
  },

  typeBtnActive: {
    backgroundColor: "#007AFF",
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },

  subtaskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },

  subtaskInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
  },

  deleteBtn: {
    fontSize: 18,
  },

  addSubtaskBtn: {
    marginTop: 8,
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#e5e5e5",
    borderRadius: 8,
    alignItems: "center",
  },
});
