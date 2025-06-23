import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import CustomBottomSheet from "../CustomBottomSheet";

type Props = {
    visible: boolean;
    onClose: () => void;
    newGroup: any;
    setNewGroup: React.Dispatch<React.SetStateAction<any>>;
    handleAddGroup: () => void;
};

export default function AddGroupSheet({
    visible,
    onClose,
    newGroup,
    setNewGroup,
    handleAddGroup,
}: Props) {
    // ...copy the relevant JSX from your HomeTab here...
    // (You can move the ScrollView and its children here)
    return (
        <CustomBottomSheet
            visible={visible}
            onClose={onClose}
            heightPercent={0.4}
        >
            <View style={{ flex: 1, flexDirection: "column" }}>
                <View
                    style={{
                        padding: 10
                    }}
                >
                    <Text style={styles.modalTitle}>Add New Group</Text>
                    <TextInput
                        style={styles.input}
                        value={newGroup}
                        onChangeText={(text) => setNewGroup(text)}
                        placeholder="Group name"
                    />
                </View>
                <View style={{ padding: 16, backgroundColor: "#fff" }}>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleAddGroup}
                    >
                        <Text style={styles.saveButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </CustomBottomSheet>
    );
}

const styles = StyleSheet.create({
    tabContainer: { padding: 10, height: "100%" },
    groupContainer: {
        marginBottom: 20,
    },
    groupTitle: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 8,
    },
    entry: {
        paddingLeft: 10,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    label: {
        fontWeight: "bold",
        fontSize: 16,
    },
    sheetContent: {
        flex: 1,
        padding: 20,
    },
    modalTitle: {
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 12,
    },
    passwordInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
        marginBottom: 12,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: "#007AFF",
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    floatingButton: {
        position: "absolute",
        bottom: 5,
        right: 5,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#007AFF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5, // for Android shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        zIndex: 1,
    },
    floatingButtonText: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: 36,
    },
    groupBox: {
        flex: 1,
        marginHorizontal: 5,
        minHeight: 100,
        borderRadius: 16,
        borderWidth: 2,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
    },
    groupText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    createBox: {
        flex: 1,
        marginHorizontal: 5,
        minHeight: 100,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: "#007AFF",
        justifyContent: "center",
        alignItems: "center",
    },
    createText: {
        color: "#007AFF",
        fontSize: 16,
        fontWeight: "500",
    },
});
