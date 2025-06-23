import { RootState } from "@/redux/store";
import { setSelectedGroup } from "@/redux/vaultSlice";
import { toPascalCase } from "@/utils/commonUtils";
import { Group } from "@/utils/dataTypes";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import EntryList from "./EntryList";

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

type GroupItem = { type: "group"; group: Group } | { type: "add" };

type Props = {
    groups: Group[];
    groupedEntries: Record<string, VaultEntry[]>;
    refreshEntries: () => void;
    setAddGroupSheetVisible: (visible: boolean) => void;
};

export default function Dashboard({
    groups,
    groupedEntries,
    refreshEntries,
    setAddGroupSheetVisible,
}: Props) {
    const selectedGroup = useSelector(
        (state: RootState) => state.vault.selectedGroup
    );
    const dispatch = useDispatch();
    const groupEntries = selectedGroup
        ? groupedEntries[selectedGroup._id] || []
        : [];
    if (selectedGroup) {
        return (
            <React.Fragment>
                <LinearGradient
                    colors={["#48dbfb", "#fff"]}
                    style={[StyleSheet.absoluteFillObject, styles.container]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Pressable
                        onPress={() => dispatch(setSelectedGroup(null))}
                        style={{ margin: 12 }}
                    >
                        <Text style={{ color: "#007AFF", fontWeight: "bold" }}>
                            ← Go back to Dashboard
                        </Text>
                    </Pressable>
                    <EntryList
                        group={selectedGroup}
                        groupedEntries={groupEntries}
                        refreshEntries={refreshEntries}
                    />
                </LinearGradient>
            </React.Fragment>
        );
    }

    const formattedGroups: GroupItem[] = [
        ...groups.map((groupItem: Group) => ({
            type: "group" as const,
            group: groupItem,
        })),
        { type: "add" },
    ];
    return (
        <>
            <LinearGradient
                colors={["#48dbfb", "#fff"]}
                style={[StyleSheet.absoluteFillObject, styles.container]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <FlatList
                    data={formattedGroups}
                    keyExtractor={(item, index) =>
                        item.type === "add" ? "create_group" : item.group.group
                    }
                    numColumns={2}
                    contentContainerStyle={styles.flatListContent}
                    columnWrapperStyle={{
                        justifyContent: "space-between",
                        marginBottom: 12,
                    }}
                    renderItem={({ item }) => {
                        if (item.type === "add") {
                            return (
                                <Pressable
                                    onPress={() =>
                                        setAddGroupSheetVisible(true)
                                    } // or whatever logic you use
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
                                onPress={() =>
                                    dispatch(setSelectedGroup(item.group))
                                }
                                style={styles.groupBox}
                            >
                                <Text style={styles.groupText}>
                                    {toPascalCase(item.group.group)}
                                </Text>
                            </Pressable>
                        );
                    }}
                />
            </LinearGradient>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
    },
    flatListContent: {
        padding: 0,
        paddingHorizontal: 12,
        paddingTop: 16,
        paddingBottom: 32, // if you want space at the bottom
    },
    title: {
        fontSize: 28,
        color: "white",
        fontWeight: "bold",
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
