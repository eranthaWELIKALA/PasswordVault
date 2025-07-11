import { useGroups } from "@/hooks/useGroups";
import { useLogs } from "@/hooks/useLogs";
import { useVault } from "@/hooks/useVault";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../contexts/AuthContext";
import HomeTab from "./HomeTab";
import LogsTab from "./LogsTab";
import SettingsTab from "./SettingsTab";

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
    const { user, signOut, token } = useContext(AuthContext);
    const router = useRouter();
    const {
        entries: vaultEntries,
        loading: loadingVault,
        fetchEntries,
        addEntry,
        updateEntry,
    } = useVault();
    const { groups, loading: loadingGroups, fetchGroups } = useGroups();
    const { logs, loading: loadingLogs, fetchLogs } = useLogs();

    useEffect(() => {
        if (!token) {
            router.replace("/login");
            return;
        }

        fetchLogs();
        fetchEntries();
        fetchGroups();
    }, [token]);

    if (!token) return null;

    return (
        <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === "Home") {
                            iconName = focused ? "home" : "home-outline";
                        } else if (route.name === "Logs") {
                            iconName = focused ? "list" : "list-outline";
                        } else if (route.name === "Settings") {
                            iconName = focused
                                ? "settings"
                                : "settings-outline";
                        }

                        return (
                            <Ionicons
                                name={iconName as any}
                                size={size}
                                color={color}
                            />
                        );
                    },
                    tabBarStyle: {
                        backgroundColor: "#272221",
                    },
                    tabBarActiveTintColor: "#fff",
                    tabBarInactiveTintColor: "gray",
                    headerTintColor: "#fff",
                    headerStyle: {
                        backgroundColor: "#272221",
                    },
                })}
            >
                <Tab.Screen
                    name="Home"
                    options={{
                        headerTitle: `Welcome${
                            user?.name ? `, ${user.name}` : ""
                        }`,
                    }}
                >
                    {() => (
                        <LinearGradient
                            colors={["#48dbfb", "#73cae2", "#fff"]}
                            style={{ flex: 1, padding: 0, margin: 0 }}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <HomeTab
                                entries={vaultEntries}
                                loading={loadingVault}
                                groups={groups}
                                loadingGroups={loadingGroups}
                                refreshEntries={fetchEntries}
                                refreshGroups={fetchGroups}
                            />
                        </LinearGradient>
                    )}
                </Tab.Screen>

                <Tab.Screen name="Logs">
                    {() => (
                        <LinearGradient
                            colors={["#48dbfb", "#73cae2", "#fff"]}
                            style={{ flex: 1, padding: 0, margin: 0 }}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <LogsTab logs={logs} loading={loadingLogs} />
                        </LinearGradient>
                    )}
                </Tab.Screen>
                <Tab.Screen name="Settings">
                    {() => (
                        <LinearGradient
                            colors={["#48dbfb", "#73cae2", "#fff"]}
                            style={{ flex: 1, padding: 0, margin: 0 }}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <SettingsTab />
                        </LinearGradient>
                    )}
                </Tab.Screen>
            </Tab.Navigator>
        </SafeAreaView>
    );
}
