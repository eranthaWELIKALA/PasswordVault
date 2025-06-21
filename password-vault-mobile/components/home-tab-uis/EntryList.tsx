import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    groupedEntries: Record<string, VaultEntry[]>;
    onEntryPress: (entry: VaultEntry) => void;
    toPascalCase: (str: string) => string;
};

export default function EntryList({
    groupedEntries,
    onEntryPress,
    toPascalCase,
}: Props) {
    return (
        <>
            {Object.entries(groupedEntries).map(([groupName, groupEntries]) => (
                <View style={styles.groupContainer} key={groupName}>
                    <Text style={styles.groupTitle}>
                        {toPascalCase(groupName)}
                    </Text>
                    {groupEntries.map((entry) => (
                        <TouchableOpacity
                            key={entry._id}
                            style={styles.entry}
                            onPress={() => onEntryPress(entry)}
                        >
                            <Text style={styles.label}>{entry.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
        </>
    );
}

const styles = StyleSheet.create({
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
