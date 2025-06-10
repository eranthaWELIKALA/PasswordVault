import { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
    Settings,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import api from "../../services/api";
import LogsTab from "./LogsTab"; // Adjust path as necessary
import SettingsTab from "./SettingsTab";
import HomeTab from "./HomeTab";

type VaultEntry = {
    id: string;
    group?: string;
    title: string;
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
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (!token) {
            console.log("No token, redirecting to login");
            router.replace("/login");
            return;
        }

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
                const response = await api.get("/vault-entries");
                setVaultEntries(response.data.entries);
            } catch (error) {
                console.error("Failed to fetch vault entries:", error);
            } finally {
                setLoadingVault(false);
            }
        };

        fetchLogs();
        fetchVaultEntries();
    }, [token]);

    if (!token) {
        return null; // or loading spinner
    }

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>Welcome, {user?.email}</Text>

            {/* Tabs */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        activeTab === 0 && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab(0)}
                >
                    <Text
                        style={
                            activeTab === 0
                                ? styles.activeTabText
                                : styles.tabText
                        }
                    >
                        Home
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        activeTab === 1 && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab(1)}
                >
                    <Text
                        style={
                            activeTab === 1
                                ? styles.activeTabText
                                : styles.tabText
                        }
                    >
                        Logs
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        activeTab === 2 && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab(2)}
                >
                    <Text
                        style={
                            activeTab === 2
                                ? styles.activeTabText
                                : styles.tabText
                        }
                    >
                        Settings
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.tabContent}>
                {activeTab === 0 && (
                    <HomeTab entries={vaultEntries} loading={loadingVault}  />
                )}
                {activeTab === 1 && (
                    <LogsTab logs={logs} loading={loadingLogs} />
                )}
                {activeTab === 2 && <SettingsTab />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    welcome: { fontSize: 18, marginBottom: 10 },
    tabBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 20,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: "blue",
    },
    tabText: {
        fontSize: 16,
        color: "#666",
    },
    activeTabText: {
        fontSize: 16,
        color: "blue",
        fontWeight: "bold",
    },
    tabContent: {
        flex: 1,
    },
});
