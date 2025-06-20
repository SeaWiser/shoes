import React from "react";
import { Modal, View, Text, StyleSheet, Pressable } from "react-native";
import { useErrorStore } from "../../store/errorStore";
import { colors } from "@constants/colors";
import { spaces } from "@constants/spaces";

interface HttpErrorModalProps {
  isModalVisible: boolean;
  closeModal: () => void;
}

export default function HttpErrorModal({
  isModalVisible,
  closeModal,
}: HttpErrorModalProps) {
  const { httpErrorMessage } = useErrorStore();

  const handleClose = () => {
    closeModal();
  };

  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Erreur</Text>
          <Text style={styles.message}>
            {httpErrorMessage || "Une erreur est survenue"}
          </Text>
          <Pressable style={styles.button} onPress={handleClose}>
            <Text style={styles.buttonText}>OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: colors.LIGHT,
    borderRadius: 10,
    padding: spaces.L,
    margin: spaces.L,
    minWidth: 280,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: spaces.M,
    color: colors.DARK,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: spaces.L,
    color: colors.DARK,
  },
  button: {
    backgroundColor: colors.BLUE,
    paddingHorizontal: spaces.L,
    paddingVertical: spaces.M,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.LIGHT,
    fontWeight: "bold",
  },
});
