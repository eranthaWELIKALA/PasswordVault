import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";

export default function SettingsTab() {
    const { signOut } = useContext(AuthContext);
    return (
        <View style={styles.tabContainer}>
            <TouchableOpacity
                style={styles.saveButton}
                onPress={() => signOut()}
            >
                <Text style={styles.saveButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    tabContainer: { padding: 10, height: "100%" },
    container: { flex: 1, padding: 20 },
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
});
