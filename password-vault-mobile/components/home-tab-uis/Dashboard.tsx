import { RootState } from "@/redux/store";
import { setSelectedGroup } from "@/redux/vaultSlice";
import { toPascalCase } from "@/utils/commonUtils";
import { Group } from "@/utils/dataTypes";
import { useNavigation } from "expo-router";
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

type GroupItem = { type: "add" | "group"; group: Group };

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
    const navigation = useNavigation();
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
                <Pressable
                    onPress={() => dispatch(setSelectedGroup(null))}
                    style={{ margin: 12 }}
                >
                    <Text style={{ color: "#272221", fontWeight: "bold" }}>
                        ← Go back to Dashboard
                    </Text>
                </Pressable>
                <EntryList refreshEntries={refreshEntries} />
            </React.Fragment>
        );
    }

    const formattedGroups: GroupItem[] = [
        ...groups.map((groupItem: Group) => ({
            type: "group" as const,
            group: groupItem,
        })),
        {
            type: "add",
            group: {
                _id: "",
                group: "",
            },
        },
    ];
    return (
        <FlatList
            data={formattedGroups}
            keyExtractor={(item, index) => item.group._id}
            numColumns={2}
            contentContainerStyle={[
                styles.flatListContent,
                { backgroundColor: "transparent" },
            ]}
            columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: 12,
                backgroundColor: "transparent",
            }}
            renderItem={({ item }) => {
                if (item.type === "add") {
                    return (
                        <Pressable
                            onPress={() => setAddGroupSheetVisible(true)}
                            style={[
                                styles.createBox,
                                { backgroundColor: "transparent" },
                            ]}
                        >
                            <Text style={styles.createText}>+ Add Group</Text>
                        </Pressable>
                    );
                }

                return (
                    <Pressable
                        onPress={() =>
                            (navigation as any).navigate("EntryList", {
                                group: item.group,
                                groupEntries: groupedEntries[item.group._id],
                            })
                        }
                        style={[
                            styles.groupBox,
                            { backgroundColor: "transparent" },
                        ]}
                    >
                        <Text style={styles.groupText}>
                            {toPascalCase(item.group.group)}
                        </Text>
                    </Pressable>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "transparent",
        flex: 1, // take full available space
        padding: 0, // make sure this is 0
        margin: 0, // just in case
    },
    flatListContent: {
        backgroundColor: "transparent",
        flexGrow: 1,
        margin: 0,
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
        // backgroundColor: "#f0f0f0",
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
