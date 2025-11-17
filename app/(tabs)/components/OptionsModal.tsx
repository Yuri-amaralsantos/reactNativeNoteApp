import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function OptionsModal({ visible, onClose, onEdit, onDelete }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <TouchableOpacity onPress={onEdit}>
            <Text style={styles.option}>✏️ Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete}>
            <Text style={styles.optionDelete}>🗑️ Excluir</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancel}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  box: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  option: {
    fontSize: 18,
    paddingVertical: 12,
  },
  optionDelete: {
    fontSize: 18,
    paddingVertical: 12,
    color: "red",
  },
  cancel: {
    fontSize: 18,
    paddingVertical: 14,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 5,
  },
});
