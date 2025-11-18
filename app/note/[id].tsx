import { Note, NoteType, Subtask } from "@/types/note";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Checkbox } from "expo-checkbox";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useNotes } from "@/stores/useNote";

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams();
  const { notes, load, updateNote, deleteNote } = useNotes();
  const [note, setNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState<null | "date" | "time">(
    null
  );
  const [eventDate, setEventDate] = useState<Date | null>(null);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const found = notes.find((n) => n.id === id);
    if (found) setNote(found);
  }, [notes, id]);

  useEffect(() => {
    const found = notes.find((n) => n.id === id);
    if (found) {
      setNote(found);

      if (found.type === "event" && found.date) {
        setEventDate(new Date(found.date));
      }
    }
  }, [notes, id]);

  if (!note) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 18, color: "#555" }}>
          Nota não encontrada.
        </Text>
      </View>
    );
  }

  async function toggleSubtaskDone(readOnlyIndex: number) {
    if (!note) return null;
    if (!note.subtasks) return;
    const updated = note.subtasks.map((s, i) =>
      i === readOnlyIndex ? { ...s, done: !s.done } : s
    );
    const patched: Partial<Note> = { subtasks: updated };
    setNote({ ...note, subtasks: updated });
    await updateNote(note.id, patched);
  }

  function startEditing() {
    setIsEditing(true);
  }

  function cancelEditing() {
    if (!note) return null;
    const original = notes.find((n) => n.id === note.id);
    if (original) setNote(original);
    setIsEditing(false);
  }

  async function saveEdits() {
    if (!note) return;

    if (!note.title.trim()) {
      Alert.alert("Título obrigatório", "Adicione um título antes de salvar.");
      return;
    }

    if (note.type === "event" && !eventDate) {
      Alert.alert("Data obrigatória", "Selecione a data e hora do evento.");
      return;
    }

    let finalDate = note.date ?? "";

    if (note.type === "event" && eventDate) {
      finalDate = eventDate.toISOString();
    }

    const patch: Partial<Note> = {
      title: note.title,
      description: note.description,
      subtasks: note.subtasks,
      date: finalDate,
      type: note.type,
    };

    await updateNote(note.id, patch);
    setIsEditing(false);
    Alert.alert("Salvo", "Alterações salvas com sucesso.");
  }

  function addSubtaskField() {
    if (!note) return null;
    const newSub: Subtask = {
      id: String(Date.now()) + Math.random(),
      title: "",
      done: false,
    };
    const updated = [...(note.subtasks ?? []), newSub];
    setNote({ ...note, subtasks: updated });
  }

  function updateSubtaskTitle(index: number, value: string) {
    if (!note) return null;
    if (!note.subtasks) return;
    const updated = [...note.subtasks];
    updated[index] = { ...updated[index], title: value };
    setNote({ ...note, subtasks: updated });
  }

  function removeSubtask(index: number) {
    if (!note) return null;
    if (!note.subtasks) return;
    const updated = note.subtasks.filter((_, i) => i !== index);
    setNote({ ...note, subtasks: updated });
  }

  async function handleDelete() {
    Alert.alert("Confirmar", "Deseja excluir esta nota?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await deleteNote(note!.id);
          router.back();
        },
      },
    ]);
  }

  function renderHeader() {
    if (!note) return null;

    return (
      <View style={styles.headerRow}>
        <Text style={styles.title}>{note.title || "Sem título"}</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {!isEditing && (
            <TouchableOpacity
              style={[styles.doneBtn, { backgroundColor: "#4F46E5" }]}
              onPress={startEditing}
            >
              <Text style={styles.doneBtnText}>Editar</Text>
            </TouchableOpacity>
          )}

          {isEditing && (
            <>
              <TouchableOpacity style={styles.doneBtn} onPress={saveEdits}>
                <Text style={styles.doneBtnText}>Salvar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.doneBtn, { backgroundColor: "#ccc" }]}
                onPress={cancelEditing}
              >
                <Text style={[styles.doneBtnText, { color: "#333" }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: "#ff3b30" }]}
            onPress={handleDelete}
          >
            <Text style={styles.doneBtnText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderAlways() {
    if (isEditing && note) {
      return (
        <>
          {isEditing && note && (
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.subtitle}>Tipo de nota</Text>
              <View style={styles.typeSelector}>
                {["text", "task", "event"].map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.typeBtn,
                      note.type === t && styles.typeBtnActive,
                    ]}
                    onPress={() => {
                      let updatedNote = { ...note, type: t as NoteType };

                      if (t === "text") {
                        delete updatedNote.subtasks;
                        delete updatedNote.date;
                      } else if (t === "task") {
                        updatedNote.subtasks = updatedNote.subtasks ?? [];
                        delete updatedNote.date;
                      } else if (t === "event") {
                        updatedNote.date =
                          updatedNote.date ?? new Date().toISOString();
                        delete updatedNote.subtasks;
                      }

                      setNote(updatedNote);
                    }}
                  >
                    <Text
                      style={{
                        color: note.type === t ? "white" : "#555",
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
            </View>
          )}

          <TextInput
            style={styles.input}
            value={note.title}
            placeholder="Título..."
            onChangeText={(t) => setNote({ ...note, title: t })}
          />
          <TextInput
            style={styles.textArea}
            multiline
            textAlignVertical="top"
            value={note.description}
            placeholder="Descrição..."
            onChangeText={(t) => setNote({ ...note, description: t })}
          />
        </>
      );
    }

    if (note) {
      return (
        <>
          <Text style={styles.readDescription}>
            {note.description ? note.description : "— Sem descrição —"}
          </Text>
        </>
      );
    }
  }

  function renderEventSection() {
    return (
      <>
        {isEditing && note ? (
          <>
            <Text style={styles.subtitle}>Data do evento</Text>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker("date")}
            >
              <Text style={styles.dateText}>
                {eventDate
                  ? `${eventDate.toLocaleDateString(
                      "pt-BR"
                    )} ${eventDate.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : "Selecionar data"}
              </Text>
            </TouchableOpacity>

            {showDatePicker === "date" && (
              <DateTimePicker
                value={eventDate ?? new Date()}
                mode="date"
                display="default"
                onChange={(_, selected) => {
                  setShowDatePicker(null);
                  if (!selected) return;

                  const d = new Date(
                    selected.getFullYear(),
                    selected.getMonth(),
                    selected.getDate()
                  );

                  setEventDate(d);

                  setTimeout(() => setShowDatePicker("time"), 300);
                }}
              />
            )}

            {showDatePicker === "time" && (
              <DateTimePicker
                value={eventDate ?? new Date()}
                mode="time"
                display="spinner"
                is24Hour={true}
                onChange={(_, selected) => {
                  setShowDatePicker(null);
                  if (!selected || !eventDate) return;

                  const d = new Date(
                    eventDate.getFullYear(),
                    eventDate.getMonth(),
                    eventDate.getDate(),
                    selected.getHours(),
                    selected.getMinutes()
                  );

                  setEventDate(d);
                }}
              />
            )}
          </>
        ) : (
          <Text style={styles.subInfo}>
            📅{" "}
            {note && note.date
              ? new Date(note.date).toLocaleDateString("pt-BR")
              : "Sem data"}
          </Text>
        )}
      </>
    );
  }

  function renderTasksSection() {
    if (isEditing && note) {
      return (
        <>
          <Text style={styles.subtitle}>Subtarefas</Text>
          {(note.subtasks ?? []).map((s, i) => (
            <View key={s.id ?? i} style={styles.editSubtaskRow}>
              <TextInput
                style={styles.subtaskInput}
                placeholder={`Subtarefa ${i + 1}`}
                value={s.title}
                onChangeText={(v) => updateSubtaskTitle(i, v)}
              />
              <TouchableOpacity onPress={() => removeSubtask(i)}>
                <Text style={styles.deleteBtn}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addSubtaskBtn}
            onPress={addSubtaskField}
          >
            <Text style={{ fontWeight: "700" }}>+ Adicionar subtarefa</Text>
          </TouchableOpacity>
        </>
      );
    }

    return (
      <>
        <Text style={styles.subtitle}>Subtarefas</Text>
        {((note && note.subtasks) ?? []).length === 0 && (
          <Text style={{ opacity: 0.6 }}>Nenhuma subtarefa</Text>
        )}
        {((note && note.subtasks) ?? []).map((s, i) => (
          <View key={s.id ?? i} style={styles.subtaskRow}>
            <Checkbox
              value={s.done}
              onValueChange={() => toggleSubtaskDone(i)}
            />
            <Text style={[styles.subtaskText, s.done && styles.done]}>
              {s.title}
            </Text>
          </View>
        ))}
      </>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {renderHeader()}
      {renderAlways()}

      {note.type === "event" && (
        <View style={{ marginTop: 12 }}>{renderEventSection()}</View>
      )}

      {note.type === "task" && (
        <View style={{ marginTop: 12 }}>{renderTasksSection()}</View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 20,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
    marginRight: 12,
  },

  input: {
    borderWidth: 0,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  doneBtn: {
    backgroundColor: "#4F46E5",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  doneBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  textArea: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    minHeight: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  readDescription: {
    fontSize: 16,
    color: "#222",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },

  dateButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
  },

  dateText: {
    fontSize: 16,
  },

  subInfo: {
    fontSize: 14,
    color: "#555",
  },

  subtaskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  subtaskText: {
    marginLeft: 10,
    fontSize: 16,
  },

  done: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },

  editSubtaskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
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
    borderRadius: 12,
    alignItems: "center",
  },
  typeSelector: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  typeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#e5e5e5",
    borderRadius: 8,
  },

  typeBtnActive: {
    backgroundColor: "#4F46E5",
  },
});
