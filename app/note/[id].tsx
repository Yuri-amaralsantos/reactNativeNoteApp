import { getNotes, updateNote } from "@/lib/notes";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function EditNote() {
  const { id } = useLocalSearchParams();
  const index = Number(id);

  const [text, setText] = useState("");

  useEffect(() => {
    async function load() {
      const notes = await getNotes();
      setText(notes[index]);
    }
    load();
  }, []);

  async function save() {
    await updateNote(index, text);
    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar nota</Text>

      <TextInput
        style={styles.textArea}
        value={text}
        onChangeText={setText}
        multiline
        textAlignVertical="top"
      />

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
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    height: 200,
    fontSize: 16,
    marginBottom: 20,
  },
});
