import React, { useRef, useMemo, useState } from "react";

import { Picker } from "@react-native-picker/picker"; // npm install @react-native-picker/picker

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Button,
} from "react-native";
import CustomBottomSheet from "../../components/CustomBottomSheet";

type VaultEntry = {
    _id: string;
    userId: string;
    deviceId: string;
    label: string;
    entryType: String;
    group?: string;
    encryptedData?: string;
    createdAt?: string;
    updatedAt?: string;
};

type Props = {
    entries: VaultEntry[];
    loading: boolean;
};

export default function HomeTab({ entries, loading }: Props) {
    const [visiblePasswords, setVisiblePasswords] = useState<
        Record<string, boolean>
    >({});
    const [sheetVisible, setSheetVisible] = useState(false);
    const [sheetEntry, setSheetEntry] = useState<VaultEntry | null>(null);

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
    const handleAddEntry = () => {
        // Example: encrypt and stringify sensitive data
        const encryptedData = JSON.stringify({
            username: newEntry.username,
            password: newEntry.password,
        });
        // Here you would call your API to save the entry
        // After saving, close the sheet and reset the form
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
    };

    return (
        <>
            <Button title="+ Add Entry" onPress={() => setAddSheetVisible(true)} />           

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
                                <Text style={styles.label}>{entry.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            />

            {/* View Entry Bottom Sheet */}
            <CustomBottomSheet
                visible={sheetVisible}
                onClose={closeSheet}
                heightPercent={0.5}
            >
                {sheetEntry ? (
                    <ScrollView>
                        <Text style={styles.modalTitle}>
                            {sheetEntry.label}
                        </Text>
                        {sheetEntry.encryptedData &&
                            (() => {
                                let obj: Record<string, any> = {};
                                try {
                                    obj = JSON.parse(sheetEntry.encryptedData);
                                } catch {
                                    return (
                                        <Text style={{ color: "red" }}>
                                            Invalid data
                                        </Text>
                                    );
                                }
                                return Object.entries(obj).map(
                                    ([key, value]) => {
                                        if (key.toLowerCase() === "password") {
                                            const id = `${sheetEntry._id}_${key}`;
                                            const isVisible =
                                                visiblePasswords[id];
                                            return (
                                                <View
                                                    key={key}
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "space-between",
                                                        width: "100%",
                                                        paddingVertical: 2,
                                                    }}
                                                >
                                                    <Text>
                                                        {toPascalCase(key)}:{" "}
                                                        {isVisible
                                                            ? String(value)
                                                            : "••••••"}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            marginLeft: 8,
                                                            color: "#007AFF",
                                                        }}
                                                        onPress={() =>
                                                            togglePasswordVisibility(
                                                                sheetEntry._id,
                                                                key
                                                            )
                                                        }
                                                    >
                                                        {isVisible
                                                            ? "🙈"
                                                            : "👁️"}
                                                    </Text>
                                                </View>
                                            );
                                        }
                                        return (
                                            <Text key={key}>
                                                {toPascalCase(key)}:{" "}
                                                {String(value)}
                                            </Text>
                                        );
                                    }
                                );
                            })()}
                    </ScrollView>
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
                        contentContainerStyle={{ paddingBottom: 80 }}
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
                        <TextInput
                            style={styles.input}
                            value={newEntry.group}
                            onChangeText={(text) =>
                                setNewEntry((e) => ({ ...e, group: text }))
                            }
                            placeholder="Group"
                        />
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
                            onPress={() => {
                                // Validate required fields
                                if (!newEntry.label)
                                    return alert("Label is required");
                                if (
                                    newEntry.entryType === "login" &&
                                    (!newEntry.username || !newEntry.password)
                                ) {
                                    return alert(
                                        "Username and Password are required for Login"
                                    );
                                }
                                if (
                                    newEntry.entryType === "card_pin" &&
                                    !newEntry.pin
                                ) {
                                    return alert(
                                        "PIN is required for Card PIN"
                                    );
                                }
                                if (
                                    newEntry.entryType === "wifi" &&
                                    (!newEntry.wifiName ||
                                        !newEntry.wifiPassword)
                                ) {
                                    return alert(
                                        "WiFi Name and Password are required for WiFi"
                                    );
                                }
                                if (
                                    newEntry.entryType === "note" &&
                                    !newEntry.note
                                ) {
                                    return alert("Note is required");
                                }

                                // Prepare encryptedData based on entryType
                                let encryptedData = "";
                                if (newEntry.entryType === "login") {
                                    encryptedData = JSON.stringify({
                                        username: newEntry.username,
                                        password: newEntry.password,
                                        link: newEntry.link,
                                        note: newEntry.note,
                                    });
                                } else if (newEntry.entryType === "card_pin") {
                                    encryptedData = JSON.stringify({
                                        pin: newEntry.pin,
                                    });
                                } else if (newEntry.entryType === "wifi") {
                                    encryptedData = JSON.stringify({
                                        wifiName: newEntry.wifiName,
                                        wifiPassword: newEntry.wifiPassword,
                                    });
                                } else if (newEntry.entryType === "note") {
                                    encryptedData = JSON.stringify({
                                        note: newEntry.note,
                                    });
                                }

                                // Call your API here with label, group, entryType, encryptedData
                                // After saving, close the sheet and reset the form
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
                            }}
                        >
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </CustomBottomSheet>
        </>
    );
}

const styles = StyleSheet.create({
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
});
