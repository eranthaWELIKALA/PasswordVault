import { Group } from "@/utils/dataTypes";
import { Picker } from "@react-native-picker/picker";
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
    newEntry: any;
    setNewEntry: React.Dispatch<React.SetStateAction<any>>;
    groups: Group[];
    showAddPassword: boolean;
    setShowAddPassword: (v: boolean) => void;
    handleAddEntry: () => void;
};

export default function AddEntrySheet({
    visible,
    onClose,
    newEntry,
    setNewEntry,
    groups,
    showAddPassword,
    setShowAddPassword,
    handleAddEntry,
}: Props) {
    // ...copy the relevant JSX from your HomeTab here...
    // (You can move the ScrollView and its children here)
    return (
        <CustomBottomSheet
            visible={visible}
            onClose={onClose}
            heightPercent={0.85}
        >
            <View style={{ flex: 1, flexDirection: "column" }}>
                <ScrollView
                    contentContainerStyle={{
                        padding: 10
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.modalTitle}>Add New Entry</Text>
                    <TextInput
                        style={styles.input}
                        value={newEntry.label}
                        onChangeText={(text) =>
                            setNewEntry((e: typeof newEntry) => ({ ...e, label: text }))
                        }
                        placeholder="Label"
                    />
                    <Text style={{ marginBottom: 4 }}>Group</Text>
                    <Picker
                        selectedValue={newEntry.group}
                        onValueChange={(value) =>
                            setNewEntry((e: typeof newEntry) => ({ ...e, group: value }))
                        }
                        style={styles.input}
                    >
                        <Picker.Item label="Select a group..." value="" />
                        {groups.map((el) => (
                            <Picker.Item
                                key={el._id}
                                label={el.group}
                                value={el._id}
                            />
                        ))}
                    </Picker>
                    <Text style={{ marginBottom: 4 }}>Entry Type</Text>
                    <Picker
                        selectedValue={newEntry.entryType}
                        onValueChange={(value) =>
                            setNewEntry((e: typeof newEntry) => ({ ...e, entryType: value }))
                        }
                        style={styles.input}
                    >
                        <Picker.Item label="Login" value="login" />
                        <Picker.Item label="Card PIN" value="card_pin" />
                        <Picker.Item label="WiFi" value="wifi" />
                        <Picker.Item label="Note" value="note" />
                    </Picker>

                    {/* Dynamic fields based on entryType */}
                    {newEntry.entryType === "login" && (
                        <>
                            <TextInput
                                style={styles.input}
                                value={newEntry.username}
                                onChangeText={(text) =>
                                    setNewEntry((e: typeof newEntry) => ({
                                        ...e,
                                        username: text,
                                    }))
                                }
                                placeholder="Username"
                            />
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginBottom: 12,
                                }}
                            >
                                <TextInput
                                    style={[
                                        styles.input,
                                        { flex: 1, marginBottom: 0 },
                                    ]}
                                    value={newEntry.password}
                                    onChangeText={(text) =>
                                        setNewEntry((e: typeof newEntry) => ({
                                            ...e,
                                            password: text,
                                        }))
                                    }
                                    placeholder="Password"
                                    secureTextEntry={!showAddPassword}
                                />
                                <TouchableOpacity
                                    onPress={() =>
                                        setShowAddPassword(!showAddPassword)
                                    }
                                    style={{ marginLeft: 8, padding: 8 }}
                                >
                                    <Text
                                        style={{
                                            color: "#007AFF",
                                            fontSize: 18,
                                        }}
                                    >
                                        {showAddPassword ? "🙈" : "👁️"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                style={styles.input}
                                value={newEntry.link}
                                onChangeText={(text) =>
                                    setNewEntry((e: typeof newEntry) => ({
                                        ...e,
                                        link: text,
                                    }))
                                }
                                placeholder="Link (optional)"
                            />
                            <TextInput
                                style={styles.input}
                                value={newEntry.note}
                                onChangeText={(text) =>
                                    setNewEntry((e: typeof newEntry) => ({
                                        ...e,
                                        note: text,
                                    }))
                                }
                                placeholder="Note (optional)"
                            />
                        </>
                    )}
                    {newEntry.entryType === "card_pin" && (
                        <TextInput
                            style={styles.input}
                            value={newEntry.pin}
                            onChangeText={(text) =>
                                setNewEntry((e: typeof newEntry) => ({ ...e, pin: text }))
                            }
                            placeholder="PIN"
                            secureTextEntry
                        />
                    )}
                    {newEntry.entryType === "wifi" && (
                        <>
                            <TextInput
                                style={styles.input}
                                value={newEntry.wifiName}
                                onChangeText={(text) =>
                                    setNewEntry((e: typeof newEntry) => ({
                                        ...e,
                                        wifiName: text,
                                    }))
                                }
                                placeholder="WiFi Name"
                            />
                            <TextInput
                                style={styles.input}
                                value={newEntry.wifiPassword}
                                onChangeText={(text) =>
                                    setNewEntry((e: typeof newEntry) => ({
                                        ...e,
                                        wifiPassword: text,
                                    }))
                                }
                                placeholder="WiFi Password"
                                secureTextEntry
                            />
                        </>
                    )}
                    {newEntry.entryType === "note" && (
                        <TextInput
                            style={[styles.input, { height: 100 }]}
                            value={newEntry.note}
                            onChangeText={(text) =>
                                setNewEntry((e: typeof newEntry) => ({ ...e, note: text }))
                            }
                            placeholder="Note"
                            multiline
                        />
                    )}
                </ScrollView>
                <View style={{ padding: 16, backgroundColor: "#fff" }}>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleAddEntry}
                    >
                        <Text style={styles.saveButtonText}>Save</Text>
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
