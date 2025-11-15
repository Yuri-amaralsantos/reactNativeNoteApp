import { addNote } from "@/lib/notes";
import { router } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function NewNote() {
  const [text, setText] = useState("");

  async function save() {
    await addNote(text);
    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Nota</Text>

      <TextInput
        style={styles.textArea}
        placeholder="Digite sua nota..."
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
