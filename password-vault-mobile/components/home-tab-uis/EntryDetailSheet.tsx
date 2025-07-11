import { toPascalCase } from "@/utils/commonUtils";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import CustomBottomSheet from "../CustomBottomSheet";

type Props = {
    visible: boolean;
    onClose: () => void;
    sheetEntry: any;
    editMode: boolean;
    setEditMode: (v: boolean) => void;
    editableEntry: Record<string, string>;
    setEditableEntry: React.Dispatch<
        React.SetStateAction<Record<string, string>>
    >;
    handleUpdateEntry: () => void;
    visiblePasswords: Record<string, boolean>;
    togglePasswordVisibility: (entryId: string, key: string) => void;
};

export default function EntryDetailSheet({
    visible,
    onClose,
    sheetEntry,
    editMode,
    setEditMode,
    editableEntry,
    setEditableEntry,
    handleUpdateEntry,
    visiblePasswords,
    togglePasswordVisibility
}: Props) {
    // ...copy the relevant JSX from your HomeTab here...
    // (You can move the ScrollView and its children here)
    return (
        <CustomBottomSheet
            visible={visible}
            onClose={onClose}
            heightPercent={0.85}
        >
            {sheetEntry ? (
                <View style={{ flex: 1, flexDirection: "column" }}>
                    <ScrollView
                        contentContainerStyle={{
                            padding: 10
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 8,
                            }}
                        >
                            <Text style={styles.modalTitle}>
                                {sheetEntry.label}
                            </Text>
                            {!editMode ? (
                                <TouchableOpacity
                                    onPress={() => setEditMode(true)}
                                >
                                    <Text style={{ color: "#272221" }}>
                                        Edit
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        gap: 16,
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            setEditMode(false);
                                            setEditableEntry(
                                                sheetEntry.decryptedData || {}
                                            );
                                        }}
                                    >
                                        <Text style={{ color: "gray" }}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleUpdateEntry}
                                    >
                                        <Text style={{ color: "#272221" }}>
                                            Save
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        {Object.entries(editableEntry).map(([key, value]) => {
                            const isPassword = key.toLowerCase() === "password";
                            const id = `${sheetEntry._id}_${key}`;
                            const isVisible = visiblePasswords[id];

                            if (editMode) {
                                return (
                                    <>
                                        {!isPassword && (
                                            <TextInput
                                                key={key}
                                                style={styles.input}
                                                value={editableEntry[key]}
                                                onChangeText={(text) =>
                                                    setEditableEntry((e) => ({
                                                        ...e,
                                                        [key]: text,
                                                    }))
                                                }
                                                placeholder={toPascalCase(key)}
                                                secureTextEntry={
                                                    isPassword && !isVisible
                                                }
                                            />
                                        )}
                                        {isPassword && (
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    marginBottom: 12,
                                                }}
                                            >
                                                <TextInput
                                                    key={key}
                                                    style={[
                                                        styles.input,
                                                        {
                                                            flex: 1,
                                                            marginBottom: 0,
                                                        },
                                                    ]}
                                                    value={editableEntry[key]}
                                                    onChangeText={(text) =>
                                                        setEditableEntry(
                                                            (e) => ({
                                                                ...e,
                                                                [key]: text,
                                                            })
                                                        )
                                                    }
                                                    placeholder={toPascalCase(
                                                        key
                                                    )}
                                                    secureTextEntry={
                                                        isPassword && !isVisible
                                                    }
                                                />
                                                <View
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        justifyContent:
                                                            "center",
                                                        alignItems: "center",
                                                        padding: 8,
                                                    }}
                                                >
                                                    <Text
                                                        onPress={() =>
                                                            togglePasswordVisibility(
                                                                sheetEntry._id!,
                                                                key
                                                            )
                                                        }
                                                        style={{
                                                            color: "#272221",
                                                            fontSize: 18,
                                                        }}
                                                    >
                                                        {isVisible
                                                            ? "🙈"
                                                            : "👁️"}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}
                                    </>
                                );
                            }

                            return (
                                <>
                                    {!isPassword && (
                                        <Text
                                            style={[styles.input, { flex: 1 }]}
                                        >
                                            {toPascalCase(key)}: {String(value)}
                                        </Text>
                                    )}

                                    {isPassword && (
                                        <View
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                paddingBottom: 12,
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.passwordInput,
                                                    {
                                                        flex: 1,
                                                        display: "flex",
                                                        flexDirection: "row",
                                                    },
                                                ]}
                                            >
                                                {toPascalCase(key)}:{" "}
                                                {isPassword && !isVisible
                                                    ? "••••••"
                                                    : String(value)}
                                            </Text>
                                            <View
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    padding: 8,
                                                }}
                                            >
                                                <Text
                                                    onPress={() =>
                                                        togglePasswordVisibility(
                                                            sheetEntry._id!,
                                                            key
                                                        )
                                                    }
                                                    style={{
                                                        color: "#272221",
                                                        fontSize: 18,
                                                    }}
                                                >
                                                    {isVisible ? "🙈" : "👁️"}
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </>
                            );
                        })}
                    </ScrollView>
                </View>
            ) : (
                <Text style={{ textAlign: "center", marginTop: 20 }}>
                    Select an entry to view details.
                </Text>
            )}
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
        backgroundColor: "#272221",
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
        backgroundColor: "#272221",
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
        borderColor: "#272221",
        justifyContent: "center",
        alignItems: "center",
    },
    createText: {
        color: "#272221",
        fontSize: 16,
        fontWeight: "500",
    },
});
