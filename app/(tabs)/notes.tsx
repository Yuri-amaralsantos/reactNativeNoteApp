import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function NotesScreen() {
  const [notes, setNotes] = useState<string[]>([]);
  const [text, setText] = useState("");

  function addNote() {
    if (!text.trim()) return;
    setNotes([...notes, text]);
    setText("");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Notas</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Escreva aqui..."
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.btn} onPress={addNote}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.note}>
            <Text>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  row: { flexDirection: "row", marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  note: {
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    borderRadius: 8,
  },
  btn: {
    padding: 10,
    marginLeft: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  btnText: { fontSize: 22, color: "white" },
});
