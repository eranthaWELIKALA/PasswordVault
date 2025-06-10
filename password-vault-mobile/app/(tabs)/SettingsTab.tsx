import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { View, StyleSheet, Button } from "react-native";

export default function SettingsTab() {
    const { signOut } = useContext(AuthContext);
    return (
        <View style={styles.container}>
            <Button title="Logout" onPress={() => signOut()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
});
