import AddEntrySheet from "@/components/home-tab-uis/AddEntrySheet";
import AddGroupSheet from "@/components/home-tab-uis/AddGroupSheet";
import Dashboard from "@/components/home-tab-uis/Dashboard";
import EntryList from "@/components/home-tab-uis/EntryList";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import { RootState } from "@/redux/store";
import api from "@/services/api";
import { encryptObject } from "@/services/crypto";
import { Group } from "@/utils/dataTypes";
import { useHeaderHeight } from "@react-navigation/elements";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HttpStatusCode } from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

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
    groups: Group[];
    loadingGroups: boolean;
    refreshEntries: () => void;
    refreshGroups: () => void;
};

type HomeTabStackParamList = {
    Dashboard: undefined;
    EntryList: undefined;
};

export default function HomeTab({
    entries,
    loading,
    groups,
    loadingGroups,
    refreshEntries,
    refreshGroups,
}: Props) {
    const Stack = createNativeStackNavigator<HomeTabStackParamList>();
    const navigation = useNavigation();

    const selectedGroup = useSelector(
        (state: RootState) => state.vault.selectedGroup
    );

    // Add Group Sheet State
    const [addGroupSheetVisible, setAddGroupSheetVisible] = useState(false);

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
    const [newGroup, setNewGroup] = useState("");

    const [showAddPassword, setShowAddPassword] = useState(false);

    useEffect(() => {
        if (selectedGroup) {
            (navigation as any).navigate("EntryList", {
                group: selectedGroup.group,
                groupEntries: groupedEntries[selectedGroup._id],
            });
        }
    }, [selectedGroup]);

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
        const groupName = entry.group || "Default";
        if (!groups[groupName]) {
            groups[groupName] = [];
        }
        groups[groupName].push(entry);
        return groups;
    }, {} as Record<string, VaultEntry[]>);

    const handleAddGroup = async () => {
        // Validate required fields
        if (!newGroup) return alert("Group name is required");

        // Prepare encryptedData based on entryType
        let data: any = {
            group: newGroup,
        };

        try {
            const response = await api.post("vault/groups", data);

            if (response.status === HttpStatusCode.Created) {
                alert("Group added successfully!");
                setAddGroupSheetVisible(false);
                setNewGroup("");
                refreshGroups();
            } else {
                alert("Failed to add group.");
            }
        } catch (error: any) {
            console.error("Error adding group:", error);
            alert("An error occurred while adding.");
        }
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

    return (
        <View style={styles.tabContainer}>
            <FloatingActionButton onPress={() => setAddSheetVisible(true)} />

            <Stack.Navigator
                screenOptions={{
                    contentStyle: {
                        borderWidth: 0,
                    },
                }}
            >
                <Stack.Screen
                    name="Dashboard"
                    component={() => (
                        <LinearGradient
                            colors={["#48dbfb", "#73cae2", "#fff"]}
                            style={{ flex: 1, padding: 0, margin: 0 }}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Dashboard
                                groups={groups}
                                groupedEntries={groupedEntries}
                                refreshEntries={refreshEntries}
                                setAddGroupSheetVisible={
                                    setAddGroupSheetVisible
                                }
                            />
                        </LinearGradient>
                    )}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="EntryList"
                    component={() => {
                        const headerHeight = useHeaderHeight();
                        return (
                            <LinearGradient
                                colors={["#48dbfb", "#73cae2", "#fff"]}
                                style={{
                                    flex: 1,
                                    paddingTop: headerHeight,
                                }}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <EntryList refreshEntries={refreshEntries} />
                            </LinearGradient>
                        );
                    }}
                    options={({
                        route,
                    }: {
                        route: { params?: { group?: Group } };
                    }) => ({
                        headerShown: true,
                        headerTransparent: true,
                        headerStyle: {
                            backgroundColor: "transparent",
                            elevation: 0,
                            shadowOpacity: 0,
                        },
                        title: route.params?.group?.group ?? "Entry List",
                    })}
                />
            </Stack.Navigator>

            <AddGroupSheet
                visible={addGroupSheetVisible}
                onClose={() => setAddGroupSheetVisible(false)}
                newGroup={newGroup}
                setNewGroup={setNewGroup}
                handleAddGroup={handleAddGroup}
            />

            {/* Add Entry Bottom Sheet */}
            <AddEntrySheet
                visible={addSheetVisible}
                onClose={() => setAddSheetVisible(false)}
                newEntry={newEntry}
                setNewEntry={setNewEntry}
                groups={groups}
                showAddPassword={showAddPassword}
                setShowAddPassword={setShowAddPassword}
                handleAddEntry={handleAddEntry}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        height: "100%",
    },
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
});
