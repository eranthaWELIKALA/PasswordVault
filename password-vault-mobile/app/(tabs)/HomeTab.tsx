import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    TextInput,
} from "react-native";
import CustomBottomSheet from "../../components/CustomBottomSheet";
import { encryptObject } from "@/services/crypto";
import api from "@/services/api";
import { HttpStatusCode } from "axios";
import { Ionicons } from "@expo/vector-icons";

type VaultEntry = {
    _id?: string;
    userId?: string;
    deviceId?: string;
    label: string;
    entryType: String;
    group?: string;
    encryptedData?: string;
    decryptedData?: Record<string, any>;
    createdAt?: string;
    updatedAt?: string;
};

type Props = {
    entries: VaultEntry[];
    loading: boolean;
    groups: string[];
    loadingGroups: boolean;
    refreshEntries: () => void;
};

export default function HomeTab({
    entries,
    loading,
    groups,
    loadingGroups,
    refreshEntries,
}: Props) {
    const [visiblePasswords, setVisiblePasswords] = useState<
        Record<string, boolean>
    >({});
    const [sheetVisible, setSheetVisible] = useState(false);
    const [sheetEntry, setSheetEntry] = useState<VaultEntry | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [editableEntry, setEditableEntry] = useState<Record<string, string>>(
        {}
    );

    // Add Entry Sheet State
    const [addSheetVisible, setAddSheetVisible] = useState(false);
    const [newEntry, setNewEntry] = useState({
        label: "",
        group: "",
        entryType: "login",
        username: "",
        password: "",
        link: "",
        note: "",
        pin: "",
        wifiName: "",
        wifiPassword: "",
    });
    const [showAddPassword, setShowAddPassword] = useState(false);

    useEffect(() => {
        if (sheetEntry?.decryptedData) {
            try {
                setEditableEntry(sheetEntry.decryptedData);
            } catch {
                setEditableEntry({});
            }
        }
    }, [sheetEntry]);

    if (loading) {
        return (
            <ActivityIndicator
                size="large"
                color="#000"
                style={{ marginTop: 20 }}
            />
        );
    }
    // Group entries by group name
    const groupedEntries = entries.reduce((groups, entry) => {
        const groupName = entry.group || "Ungrouped";
        if (!groups[groupName]) {
            groups[groupName] = [];
        }
        groups[groupName].push(entry);
        return groups;
    }, {} as Record<string, VaultEntry[]>);

    function toPascalCase(str: string) {
        return str.replace(/(^\w|_\w)/g, (match) =>
            match.replace("_", "").toUpperCase()
        );
    }

    const togglePasswordVisibility = (entryId: string, key: string) => {
        const id = `${entryId}_${key}`;
        setVisiblePasswords((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const openSheet = (entry: VaultEntry) => {
        setSheetEntry(entry);
        setSheetVisible(true);
    };
    const closeSheet = () => {
        setSheetVisible(false);
        setSheetEntry(null);
    };

    // Handler for adding a new entry (replace with your API call)
    const handleAddEntry = async () => {
        // Validate required fields
        if (!newEntry.label) return alert("Label is required");
        if (
            newEntry.entryType === "login" &&
            (!newEntry.username || !newEntry.password)
        ) {
            return alert("Username and Password are required for Login");
        }
        if (newEntry.entryType === "card_pin" && !newEntry.pin) {
            return alert("PIN is required for Card PIN");
        }
        if (
            newEntry.entryType === "wifi" &&
            (!newEntry.wifiName || !newEntry.wifiPassword)
        ) {
            return alert("WiFi Name and Password are required for WiFi");
        }
        if (newEntry.entryType === "note" && !newEntry.note) {
            return alert("Note is required");
        }

        // Prepare encryptedData based on entryType
        let data: VaultEntry = {
            label: newEntry.label,
            entryType: newEntry.entryType,
            group: newEntry.group,
        };
        let dataObj = {};
        if (newEntry.entryType === "login") {
            dataObj = {
                username: newEntry.username,
                password: newEntry.password,
                link: newEntry.link,
                note: newEntry.note,
            };
        } else if (newEntry.entryType === "card_pin") {
            dataObj = {
                pin: newEntry.pin,
            };
        } else if (newEntry.entryType === "wifi") {
            dataObj = {
                wifiName: newEntry.wifiName,
                wifiPassword: newEntry.wifiPassword,
            };
        } else if (newEntry.entryType === "note") {
            dataObj = {
                note: newEntry.note,
            };
        }
        data.encryptedData = encryptObject(dataObj);

        try {
            const response = await api.post("vault", data);

            if (response.status === HttpStatusCode.Created) {
                alert("Entry saved successfully!");
                setAddSheetVisible(false);
                setNewEntry({
                    label: "",
                    group: "",
                    entryType: "login",
                    username: "",
                    password: "",
                    link: "",
                    note: "",
                    pin: "",
                    wifiName: "",
                    wifiPassword: "",
                });
                refreshEntries();
            } else {
                alert("Failed to save entry.");
            }
        } catch (error: any) {
            console.error("Error saving vault entry:", error);
            alert("An error occurred while saving.");
        }
    };

    const handleUpdateEntry = async () => {
        try {
            const updatedData = {
                ...sheetEntry,
                encryptedData: encryptObject(editableEntry),
            };
            const response = await api.put(
                `vault/${sheetEntry?._id}`,
                updatedData
            );
            if (response.status === 200) {
                refreshEntries();
                alert("Updated successfully!");
                setEditMode(false);
                closeSheet();
            } else {
                alert("Failed to update.");
            }
        } catch (err) {
            alert("Error updating entry.");
        }
    };

    return (
        <View style={styles.tabContainer}>
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setAddSheetVisible(true)}
            >
                <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>

            <ScrollView>
                <FlatList
                    data={Object.entries(groupedEntries)}
                    keyExtractor={([groupName]) => groupName}
                    renderItem={({ item: [groupName, groupEntries] }) => (
                        <View style={styles.groupContainer}>
                            <Text style={styles.groupTitle}>
                                {toPascalCase(groupName)}
                            </Text>
                            {groupEntries.map((entry) => (
                                <TouchableOpacity
                                    key={entry._id}
                                    style={styles.entry}
                                    onPress={() => openSheet(entry)}
                                >
                                    <Text style={styles.label}>
                                        {entry.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                />
            </ScrollView>

            {/* View Entry Bottom Sheet */}
            <CustomBottomSheet
                visible={sheetVisible}
                onClose={() => {
                    setEditMode(false);
                    closeSheet();
                }}
                heightPercent={0.85}
            >
                {sheetEntry ? (
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <ScrollView
                            contentContainerStyle={{
                                padding: 10,
                                paddingBottom: 80,
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
                                        <Text style={{ color: "#007AFF" }}>
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
                                                    sheetEntry.decryptedData ||
                                                        {}
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
                                            <Text style={{ color: "#007AFF" }}>
                                                Save
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>

                            {Object.entries(editableEntry).map(
                                ([key, value]) => {
                                    const isPassword =
                                        key.toLowerCase() === "password";
                                    const id = `${sheetEntry._id}_${key}`;
                                    const isVisible = visiblePasswords[id];

                                    if (editMode) {
                                        return (
                                            <>
                                                {!isPassword && (
                                                    <TextInput
                                                        key={key}
                                                        style={styles.input}
                                                        value={
                                                            editableEntry[key]
                                                        }
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
                                                            isPassword &&
                                                            !isVisible
                                                        }
                                                    />
                                                )}
                                                {isPassword && (
                                                    <View
                                                        style={{
                                                            flexDirection:
                                                                "row",
                                                            alignItems:
                                                                "center",
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
                                                            value={
                                                                editableEntry[
                                                                    key
                                                                ]
                                                            }
                                                            onChangeText={(
                                                                text
                                                            ) =>
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
                                                                isPassword &&
                                                                !isVisible
                                                            }
                                                        />
                                                        <View
                                                            style={{
                                                                display: "flex",
                                                                flexDirection:
                                                                    "row",
                                                                justifyContent:
                                                                    "center",
                                                                alignItems:
                                                                    "center",
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
                                                                    color: "#007AFF",
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
                                                    style={[
                                                        styles.input,
                                                        { flex: 1 },
                                                    ]}
                                                >
                                                    {toPascalCase(key)}:{" "}
                                                    {String(value)}
                                                </Text>
                                            )}

                                            {isPassword && (
                                                <View
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        justifyContent:
                                                            "space-between",
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
                                                                flexDirection:
                                                                    "row",
                                                            },
                                                        ]}
                                                    >
                                                        {toPascalCase(key)}:{" "}
                                                        {isPassword &&
                                                        !isVisible
                                                            ? "••••••"
                                                            : String(value)}
                                                    </Text>
                                                    <View
                                                        style={{
                                                            display: "flex",
                                                            flexDirection:
                                                                "row",
                                                            justifyContent:
                                                                "center",
                                                            alignItems:
                                                                "center",
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
                                                                color: "#007AFF",
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
                            )}
                        </ScrollView>
                    </View>
                ) : (
                    <Text style={{ textAlign: "center", marginTop: 20 }}>
                        Select an entry to view details.
                    </Text>
                )}
            </CustomBottomSheet>

            {/* Add Entry Bottom Sheet */}
            <CustomBottomSheet
                visible={addSheetVisible}
                onClose={() => setAddSheetVisible(false)}
                heightPercent={0.85}
            >
                <View style={{ flex: 1, flexDirection: "column" }}>
                    <ScrollView
                        contentContainerStyle={{
                            padding: 10,
                            paddingBottom: 80,
                        }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Text style={styles.modalTitle}>Add New Entry</Text>
                        <TextInput
                            style={styles.input}
                            value={newEntry.label}
                            onChangeText={(text) =>
                                setNewEntry((e) => ({ ...e, label: text }))
                            }
                            placeholder="Label"
                        />
                        <Text style={{ marginBottom: 4 }}>Group</Text>
                        <Picker
                            selectedValue={newEntry.group}
                            onValueChange={(value) =>
                                setNewEntry((e) => ({ ...e, group: value }))
                            }
                            style={styles.input}
                        >
                            <Picker.Item label="Select a group..." value="" />
                            {groups.map((group, index) => (
                                <Picker.Item
                                    key={index}
                                    label={group}
                                    value={group}
                                />
                            ))}
                        </Picker>
                        <Text style={{ marginBottom: 4 }}>Entry Type</Text>
                        <Picker
                            selectedValue={newEntry.entryType}
                            onValueChange={(value) =>
                                setNewEntry((e) => ({ ...e, entryType: value }))
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
                                        setNewEntry((e) => ({
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
                                            setNewEntry((e) => ({
                                                ...e,
                                                password: text,
                                            }))
                                        }
                                        placeholder="Password"
                                        secureTextEntry={!showAddPassword}
                                    />
                                    <TouchableOpacity
                                        onPress={() =>
                                            setShowAddPassword((v) => !v)
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
                                        setNewEntry((e) => ({
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
                                        setNewEntry((e) => ({
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
                                    setNewEntry((e) => ({ ...e, pin: text }))
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
                                        setNewEntry((e) => ({
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
                                        setNewEntry((e) => ({
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
                                    setNewEntry((e) => ({ ...e, note: text }))
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
        </View>
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
});
