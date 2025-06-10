import { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../contexts/AuthContext";

export default function LoginScreen() {
    const router = useRouter();
    const { signIn } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            console.log("=============");
            await signIn(email, password);
            router.replace("/home");
        } catch (error: any) {
            Alert.alert("Login failed", error.message || "Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Password Vault Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />
            <Button title="Log In" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginVertical: 8,
        borderRadius: 4,
    },
    title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
});
