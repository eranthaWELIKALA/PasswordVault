import { useGroups } from "@/hooks/useGroups";
import { useLogs } from "@/hooks/useLogs";
import { useVault } from "@/hooks/useVault";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
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
                        refreshEntries={fetchEntries}
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
