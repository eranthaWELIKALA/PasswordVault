import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { View, StyleSheet, Button } from "react-native";

export default function SettingsTab() {
    const { signOut } = useContext(AuthContext);
    return (
        <View style={styles.tabContainer}>
            <Button title="Logout" onPress={() => signOut()} />
        </View>
    );
}

const styles = StyleSheet.create({
    tabContainer: { padding: 10, height: "100%" },
    container: { flex: 1, padding: 20 },
});
