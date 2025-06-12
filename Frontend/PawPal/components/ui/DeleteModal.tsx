import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Colors } from "@/constants/Colors";

type DeleteModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  petName: string;
  startDate: string;
  endDate: string;
};

export const DeleteBookingModal = (prop: DeleteModalProps) => {
  const { visible, onClose, onConfirmDelete, startDate, endDate, petName } =
    prop;
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Delete booking</Text>
          <Text style={styles.message}>
            Are you sure you want to delete{" "}
            <Text style={{ fontWeight: "bold" }}>
              {petName + " from " + startDate + " to " + endDate}
            </Text>
            ?
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={onConfirmDelete}
            >
              <Text style={styles.confirmText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: Colors.labelTextColor,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    color: Colors.labelTextColor,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  cancelText: {
    color: Colors.labelTextColor,
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: Colors.urgentTextColor,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  confirmText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "600",
  },
});
