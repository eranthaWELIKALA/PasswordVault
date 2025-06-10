import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function SplashScreen() {
    return (
        <View style={styles.container}>
            {/* You can replace this with a logo or animated loader */}
            <Text style={styles.title}>Password Vault</Text>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
});
