import api from "@/services/api";
import { encryptObject } from "@/services/crypto";
import { Group } from "@/utils/dataTypes";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
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
    group: Group;
    groupedEntries: VaultEntry[];
    refreshEntries: () => void;
};

export default function EntryList({
    group,
    groupedEntries,
    refreshEntries,
}: Props) {
    const [visiblePasswords, setVisiblePasswords] = useState<
        Record<string, boolean>
    >({});
    const [sheetVisible, setSheetVisible] = useState(false);
    const [sheetEntry, setSheetEntry] = useState<VaultEntry | null>(null);
    const [editableEntry, setEditableEntry] = useState<Record<string, string>>(
        {}
    );
    const [editMode, setEditMode] = useState(false);

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
    return (
        <>
            {groupedEntries.map((entry) => (
                <TouchableOpacity
                    key={entry._id}
                    style={styles.entry}
                    onPress={() => openSheet(entry)}
                >
                    <Text style={styles.label}>{entry.label}</Text>
                </TouchableOpacity>
            ))}

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
});
