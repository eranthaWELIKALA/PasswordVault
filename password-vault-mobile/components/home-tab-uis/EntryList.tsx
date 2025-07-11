import api from "@/services/api";
import { encryptObject } from "@/services/crypto";
import { Group } from "@/utils/dataTypes";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import EntryDetailSheet from "./EntryDetailSheet";

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
    // group: Group;
    // groupEntries: VaultEntry[];
    refreshEntries: () => void;
};

import type { RouteProp } from "@react-navigation/native";
import { ConfirmModal } from "../confirmModel";

type RouteParams = {
    group: Group;
    groupEntries: VaultEntry[];
};

type EntryListScreenParamList = {
    EntryList: RouteParams;
};

export default function EntryList({
    // group,
    // groupEntries,
    refreshEntries,
}: Props) {
    const route = useRoute<RouteProp<EntryListScreenParamList, "EntryList">>();
    const { group, groupEntries } = route.params;
    const [visiblePasswords, setVisiblePasswords] = useState<
        Record<string, boolean>
    >({});
    const [sheetVisible, setSheetVisible] = useState(false);
    const [sheetEntry, setSheetEntry] = useState<VaultEntry | null>(null);
    const [editableEntry, setEditableEntry] = useState<Record<string, string>>(
        {}
    );
    const [editMode, setEditMode] = useState(false);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState<VaultEntry | null>(null);

    useEffect(() => {
        if (sheetEntry?.decryptedData) {
            try {
                setEditableEntry(sheetEntry.decryptedData);
            } catch {
                setEditableEntry({});
            }
        }
    }, [sheetEntry]);

    const openSheet = (entry: VaultEntry) => {
        setSheetEntry(entry);
        setSheetVisible(true);
    };
    const closeSheet = () => {
        setSheetVisible(false);
        setSheetEntry(null);
    };

    const togglePasswordVisibility = (entryId: string, key: string) => {
        const id = `${entryId}_${key}`;
        setVisiblePasswords((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
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

    const handleDeleteEntry = (entry: VaultEntry) => {
        setEntryToDelete(entry);
        setConfirmDeleteVisible(true);
    };

    const onConfirmDelete = async () => {
        if (!entryToDelete) return;

        try {
            const response = await api.delete(`vault/${entryToDelete._id}`);
            if (response.status === 200) {
                refreshEntries();
                alert("Deleted successfully");
            } else {
                alert("Delete failed");
            }
        } catch (error) {
            alert("Error deleting entry");
        } finally {
            setConfirmDeleteVisible(false);
            setEntryToDelete(null);
        }
    };

    const onCancelDelete = () => {
        setConfirmDeleteVisible(false);
        setEntryToDelete(null);
    };

    const renderRightActions = (entry: VaultEntry) => (
        <RectButton
            style={styles.rightAction}
            onPress={() => handleDeleteEntry(entry)}
        >
            <Ionicons name="trash-outline" size={24} color="#fff" />
        </RectButton>
    );

    return (
        <>
            <ConfirmModal
                visible={confirmDeleteVisible}
                title="Delete"
                message="Are you sure you want to delete this entry?"
                onConfirm={onConfirmDelete}
                onCancel={onCancelDelete}
            />

            {groupEntries &&
                groupEntries.map((entry) => (
                    <Swipeable
                        key={entry._id}
                        renderRightActions={() => renderRightActions(entry)}
                    >
                        <RectButton
                            style={styles.entry}
                            onPress={() => openSheet(entry)}
                        >
                            <Text style={styles.label}>{entry.label}</Text>
                        </RectButton>
                    </Swipeable>
                ))}

            {!groupEntries && (
                <View style={styles.entry}>
                    <Text style={styles.label}>No entries</Text>
                </View>
            )}

            {/* View Entry Bottom Sheet */}
            <EntryDetailSheet
                visible={sheetVisible}
                onClose={() => {
                    setEditMode(false);
                    closeSheet();
                }}
                sheetEntry={sheetEntry}
                editMode={editMode}
                setEditMode={setEditMode}
                editableEntry={editableEntry}
                setEditableEntry={setEditableEntry}
                handleUpdateEntry={handleUpdateEntry}
                visiblePasswords={visiblePasswords}
                togglePasswordVisibility={togglePasswordVisibility}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
    },
    groupContainer: { marginBottom: 20 },
    groupTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 8 },
    entry: {
        paddingLeft: 10,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    label: { fontWeight: "bold", fontSize: 16 },
    rightAction: {
        backgroundColor: "#ff3b30",
        justifyContent: "center",
        alignItems: "center",
        width: 64,
        height: "100%",
    },
    deleteButton: {
        backgroundColor: "#f78f8e",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingHorizontal: 20,
        flex: 1,
    },
    deleteText: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 16,
    },
});
