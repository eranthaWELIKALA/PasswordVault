import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import api from "../../services/api";
import LogsTab from "./LogsTab";
import SettingsTab from "./SettingsTab";
import HomeTab from "./HomeTab";
import { decryptObject } from "@/services/crypto";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

type VaultEntry = {
    _id?: string;
    userId?: string;
    deviceId?: string;
    label: string;
    entryType: String;
    group?: string;
    encryptedData?: string;
    createdAt?: string;
    updatedAt?: string;
    decryptedData?: Record<string, any>;
};

type LogItem = {
    _id: string;
    timestamp: string;
    success: boolean;
    reason: string;
};

export default function HomeScreen() {
    const { user, signOut, token } = useContext(AuthContext);
    const router = useRouter();
    const [logs, setLogs] = useState<LogItem[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [vaultEntries, setVaultEntries] = useState<VaultEntry[]>([]);
    const [loadingVault, setLoadingVault] = useState(false);
    const [groups, setGroups] = useState<string[]>([]);
    const [loadingGroups, setLoadingGroups] = useState(false);

    const fetchLogs = async () => {
        setLoadingLogs(true);
        try {
            const response = await api.get("/audit-logs");
            setLogs(response.data.logs);
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        } finally {
            setLoadingLogs(false);
        }
    };

    const fetchVaultEntries = async () => {
        setLoadingVault(true);
        try {
            const response = await api.get("/vault");
            response.data.entries.map((entry: VaultEntry) => {
                entry.decryptedData = decryptObject(entry.encryptedData!);
            });
            setVaultEntries(response.data.entries);
        } catch (error) {
            console.error("Failed to fetch vault entries:", error);
        } finally {
            setLoadingVault(false);
        }
    };

    const fetchGroups = async () => {
        setLoadingGroups(true);
        try {
            const response = await api.get("/vault/groups");
            setGroups(response.data.groups);
        } catch (error) {
            console.error("Failed to fetch groups:", error);
        } finally {
            setLoadingGroups(false);
        }
    };

    useEffect(() => {
        if (!token) {
            router.replace("/login");
            return;
        }

        fetchLogs();
        fetchVaultEntries();
        fetchGroups();
    }, [token]);

    if (!token) return null;

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Home") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Logs") {
                        iconName = focused ? "list" : "list-outline";
                    } else if (route.name === "Settings") {
                        iconName = focused ? "settings" : "settings-outline";
                    }

                    return (
                        <Ionicons
                            name={iconName as any}
                            size={size}
                            color={color}
                        />
                    );
                },
                tabBarActiveTintColor: "blue",
                tabBarInactiveTintColor: "gray",
            })}
        >
            <Tab.Screen
                name="Home"
                options={{
                    headerTitle: `Welcome${user?.name ? `, ${user.name}` : ""}`,
                }}
            >
                {() => (
                    <HomeTab
                        entries={vaultEntries}
                        loading={loadingVault}
                        groups={groups}
                        loadingGroups={loadingGroups}
                        refreshEntries={fetchVaultEntries}
                    />
                )}
            </Tab.Screen>

            <Tab.Screen name="Logs">
                {() => <LogsTab logs={logs} loading={loadingLogs} />}
            </Tab.Screen>
            <Tab.Screen name="Settings" component={SettingsTab} />
        </Tab.Navigator>
    );
}
