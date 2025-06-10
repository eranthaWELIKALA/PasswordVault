import { useContext, useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { useRouter } from "expo-router";
import api from "../services/api";

export default function HomeScreen() {
    const { user, signOut, token } = useContext(AuthContext);
    const router = useRouter();
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        if (!token) {
            router.replace("/login");
            return;
        }
        fetchLogs();
    }, [token]);

    async function fetchLogs() {
        try {
            const response = await api.post("/audit-logs");
            setLogs(response.data.logs);
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>Welcome, {user?.email}</Text>
            <Button title="Logout" onPress={() => signOut()} />
            <Text style={styles.title}>Login History (Last 50)</Text>
            <FlatList
                data={logs}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.logItem}>
                        <Text>
                            {new Date(item.timestamp).toLocaleString()} -{" "}
                            {item.success ? "Success" : "Fail"} - {item.reason}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    welcome: { fontSize: 18, marginBottom: 10 },
    title: { marginTop: 20, fontSize: 16, fontWeight: "bold" },
    logItem: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
});
