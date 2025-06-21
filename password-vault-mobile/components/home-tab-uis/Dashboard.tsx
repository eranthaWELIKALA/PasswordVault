import React from "react";
import { FlatList, Pressable, StyleSheet, Text } from "react-native";

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

type GroupItem = { type: "group"; groupName: string } | { type: "add" };

type Props = {
    groups: string[];
    groupedEntries: Record<string, VaultEntry[]>;
    onEntryPress: (entry: VaultEntry) => void;
    toPascalCase: (str: string) => string;
    setAddGroupSheetVisible: (visible: boolean) => void;
};

export default function EntryList({
    groups,
    groupedEntries,
    onEntryPress,
    toPascalCase,
    setAddGroupSheetVisible
}: Props) {
    const formattedGroups: GroupItem[] = [
        ...Object.keys(groupedEntries).map((groupName) => ({
            type: "group" as const, // 👈 ensures type is exactly "group"
            groupName,
        })),
        { type: "add" },
    ];
    return (
        <>
            <FlatList
                data={formattedGroups}
                keyExtractor={(item, index) =>
                    item.type === "add" ? "create_group" : item.groupName
                }
                numColumns={2}
                contentContainerStyle={{ padding: 10 }}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginBottom: 12,
                }}
                renderItem={({ item }) => {
                    if (item.type === "add") {
                        return (
                            <Pressable
                                onPress={() => setAddGroupSheetVisible(true)} // or whatever logic you use
                                style={styles.createBox}
                            >
                                <Text style={styles.createText}>
                                    + Add Group
                                </Text>
                            </Pressable>
                        );
                    }

                    return (
                        <Pressable
                            // onPress={() => openGroupSheet(item.groupName)}
                            style={styles.groupBox}
                        >
                            <Text style={styles.groupText}>
                                {toPascalCase(item.groupName)}
                            </Text>
                        </Pressable>
                    );
                }}
            />
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
