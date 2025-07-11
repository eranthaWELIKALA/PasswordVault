import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ConfirmModalProps = {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export function ConfirmModal({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.backdrop}>
                <View style={styles.modal}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttons}>
                        <TouchableOpacity
                            onPress={onCancel}
                            style={styles.buttonCancel}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onConfirm}
                            style={styles.buttonConfirm}
                        >
                            <Text
                                style={[styles.buttonText, { color: "white" }]}
                            >
                                Delete
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "#00000099",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
    },
    title: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
    message: { fontSize: 16, marginBottom: 20 },
    buttons: { flexDirection: "row", justifyContent: "flex-end" },
    buttonCancel: { marginRight: 10, padding: 10 },
    buttonConfirm: { backgroundColor: "red", borderRadius: 5, padding: 10 },
    buttonText: { fontSize: 16 },
});
